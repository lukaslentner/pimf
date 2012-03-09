<?php

/*
the search engine

call has to look like:

login:
{
		"username":"",
		"password":""
}

data:
	{
		//logic may be "AND" or "OR"
		"logic":"AND";

		defined in items/pattern.txt e.g.
		"pattern":
			[
				{"subject": "any", "comparator": "has", "value": "1"},...
			]
			
		"report":"false" //true needed for getAsReport.php, per default it is false (not needed in the call)	
	}

answer looks like:
{
  metaData: {
    "idProperty": "uid",
    "root": "records",

    "fields": [
      "uid":{"name":"uid","type":"string"},
      "id":{"name":"id","type":"int"},
      "name":{"name":"name","type":"string"},
      "description":{"name":"description","type":"string"},
      "image":{"name":"image","type":"int"},
	  "ruleViolation":{"name":"ruleViolation","type":"auto"},
      "parentFolderId":{"name":"parentFolderId","type":"int"},
      "itemFolderLinks":{"name":"itemFolderLinks","type":"auto"},
      "type":{"name":"description","type":"string"},
      "manualURL":{"name":"manualURL","type":"string"},
      "homepageURL":{"name":"homepageURL","type":"string"},
      "freePropertyValue1":{"name":"freePropertyValue1","type":"string"},
      "freePropertyValue3":{"name":"freePropertyValue2","type":"float"},
      "freePropertyValue4:{"name":"freePropertyValue3","type":"auto"}"
    ],
    "sortInfo": {
      "field": "name",
      "direction": "ASC"
    },
    freeProperties: [
      {
        id: "1",
        name: "VDE Prüfdatum",
        format: "date"
        ...
      },
      {
        id: "2",
        name: "Widerstand in Ohm"
      },
      {
        id: "3",
        name: "Max. Leistung in W",
        columnWidth: "200"
      },
      {
        id: "4",
        name: "Wellenlänge"
      }
    ]
  },
  "success": true,
  "total": 3,
  "records": [
    {
      uid: 'item23',
      id: '23',
      type: 'item',
      name: 'Hallo1',
	  image:123
      itemFolderLinks: [
        "3",
        "4",
        "5"
      ],
      "freePropertyValue1": "2010/07/01",
      "freePropertyValue3": "123"
    },
    {
      uid: 'folder90',
      name: 'Hallo3',
      type: 'vendor'
    },
    {
      uid: 'folder91',
      name: 'Hallo3',
      type: 'vendor'
    },
    {
      uid: 'folder46',
      name: 'Hallo2',
      type: 'category',
      "freePropertyValue4": "123"
    }
  ]
  "version":13
}

example: http://localhost/PIMF/trunk/server/items/get.php?data={"logic":"OR","pattern":[{"subject":"any","comparator":"has","value":"2"},{"subject": "any", "comparator": "has", "value": "a"},{"subject":"ruleViolation","comparator":"is not empty","value":""}]}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(0,false,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("pattern","logic");
$json->checkKeys($needed);

//set logic parameter
switch ($call["logic"]){
    case "AND":
		$lg = "AND";
	break;
	case "OR":
		$lg = "OR";
	break;
	default:
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}

//check if response is needed for getAsReport.php (per default set to false)
if(!isset($call["report"])){
	$report = false;
} else {
	$report = true;
}

//define flags for each subject so it can be determined if that subject was part of the call
$subjectFlags = array();
$subjectFlags["any"]			= FALSE;
$subjectFlags["id"]				= FALSE;
$subjectFlags["name"]			= FALSE;
$subjectFlags["description"]	= FALSE;
$subjectFlags["parentFolderId"]	= FALSE;
$subjectFlags["path"]			= FALSE;
$subjectFlags["type"]			= FALSE;
$subjectFlags["freeProperty"]	= FALSE; //is an array which contains the freePropertyValueIds if "true"
$subjectFlags["violation"]		= FALSE;
//define array containing all the querys
$queryStrings = array();
$queryStrings["folders"]["any"]["has"]			 				= "";
$queryStrings["itemFolderLinks"]["any"]["has"] 					= "";
$queryStrings["items"]["any"]["has"] 							= "";
$queryStrings["freePropertyValues"]["any"]["has"] 				= "";
$queryStrings["folders"]["id"]["is"] 							= "";
$queryStrings["items"]["id"]["is"] 								= "";
$queryStrings["folders"]["name"]["is"]							= "";
$queryStrings["items"]["name"]["is"]							= "";
$queryStrings["folders"]["name"]["has"]							= "";
$queryStrings["items"]["name"]["has"]							= "";
$queryStrings["folders"]["description"]["is"] 					= "";
$queryStrings["items"]["description"]["is"] 					= "";
$queryStrings["folders"]["description"]["has"] 					= "";
$queryStrings["items"]["description"]["has"] 					= "";
$queryStrings["folders"]["parentFolderId"]["is"]				= "";
$queryStrings["itemFolderLinks"]["parentFolderId"]["is"]		= "";
$queryStrings["freePropertyValues"]["freeProperty"]["is"]		= "";
$queryStrings["freePropertyValues"]["freeProperty"]["has"]		= "";
$patternPath = array(); //array containing the value from each path pattern; needed because path has to be handled seperatly
$patternType = array(); //keys tell which results should be shown
//loop through all patterns
foreach($call["pattern"] as $pattern){
	//check if the format of the pattern is correct
	if(array_key_exists("subject",$pattern) AND array_key_exists("comparator",$pattern) AND array_key_exists("value",$pattern)){

		//switch through all subjects in pattern (pattern.txt explains the syntax of each pattern)
		//the goal of this part is to construct the query-parts
		switch ($pattern["subject"]){
		    case "any":
				/*
				any
				  has               A simple search:
				                      Folders.id is
				                      Folders.name has
				                      Folders.description has
				                      Folders.parentFolderId is
				                      ItemFolderLinks.folderId is
				                      ItemFolderLinks.Items.id is
				                      ItemFolderLinks.Items.name has
				                      ItemFolderLinks.Items.description has
				                      ItemFolderLinks.Items.FreePropertyValue[id].value has
				*/
				//check if the format of the pattern is correct
				if($pattern["comparator"] == "has"){
					$subjectFlags["any"] = TRUE;
					$tmpVal = mysql_real_escape_string($pattern["value"]);
					//check if value is numeric (if its a string remove all cols from the query that expect int)
					if(is_numeric($pattern["value"])){
						$queryStrings["folders"]["any"]["has"] .= sprintf("(Folders.id = '%s' OR Folders.name LIKE '%%%s%%' OR Folders.description LIKE
																'%%%s%%' OR Folders.parentFolderId = '%s' ) %s ",$tmpVal,$tmpVal,$tmpVal,$tmpVal,$lg);
						$queryStrings["itemFolderLinks"]["any"]["has"] .= sprintf("(ItemFolderLinks.folderId = '%s' ) %s ",$tmpVal,$lg);
						$queryStrings["items"]["any"]["has"] .= sprintf("(Items.id = '%s' OR Items.name LIKE '%%%s%%' OR Items.description LIKE
															'%%%s%%' ) %s ",$tmpVal,$tmpVal,$tmpVal,$lg);
						$queryStrings["freePropertyValues"]["any"]["has"] .= sprintf("(FreePropertyValues.value LIKE '%%%s%%' ) %s ",$tmpVal,$lg);
					} else {
						$queryStrings["folders"]["any"]["has"] .= sprintf("(Folders.name LIKE '%%%s%%' OR Folders.description LIKE '%%%s%%' ) %s ",
						 										$tmpVal,$tmpVal,$lg);
						$queryStrings["itemFolderLinks"]["any"]["has"] .= "";
						$queryStrings["items"]["any"]["has"] .= sprintf("(Items.name LIKE '%%%s%%' OR Items.description LIKE '%%%s%%' ) %s ",
						 									$tmpVal,$tmpVal,$lg);
						$queryStrings["freePropertyValues"]["any"]["has"] .= sprintf("(FreePropertyValues.value LIKE '%%%s%%' ) %s ",$tmpVal,$lg);
					}
				} else {
					new error(400,JSON_WRONG_CALL_FORMAT);
					exit();
				}
			break;
			case "id":
				/*
				id
				  is                A fix id
				                      Folders.id is
				                      ItemFolderLinks.Items.id is
				*/
				//check if the format of the pattern is correct
				if($pattern["comparator"] == "is" AND is_numeric($pattern["value"])){
					$subjectFlags["id"]	= TRUE;
					$tmpVal = mysql_real_escape_string($pattern["value"]);
					$queryStrings["folders"]["id"]["is"] .= sprintf("(Folders.id = '%s') %s ",$tmpVal,$lg);
					$queryStrings["items"]["id"]["is"] .= sprintf("(Items.id = '%s') %s ",$tmpVal,$lg);
				} else {
					new error(400,JSON_WRONG_CALL_FORMAT);
					exit();
				}
			break;
			case "name":
				/*
				name
				  is                A fix name
				                      Folders.name is
				                      ItemFolderLinks.Items.name is
				  has               A part of a name
				                      Folders.name is
				                      ItemFolderLinks.Items.name is
				*/
				$tmpVal = mysql_real_escape_string($pattern["value"]);
				//check if the format of the pattern is correct
				switch($pattern["comparator"]){
					case "is":
						$subjectFlags["name"] = TRUE;
						$queryStrings["folders"]["name"]["is"] .= sprintf("(Folders.name = '%s') %s ",$tmpVal,$lg);
						$queryStrings["items"]["name"]["is"] .= sprintf("(Items.name = '%s') %s ",$tmpVal,$lg);
					break;
					case "has":
						$subjectFlags["name"] = TRUE;
						$queryStrings["folders"]["name"]["is"] .= sprintf("(Folders.name LIKE '%%%s%%') %s ",$tmpVal,$lg);
						$queryStrings["items"]["name"]["is"] .= sprintf("(Items.name LIKE '%%%s%%') %s ",$tmpVal,$lg);
					break;
					default:
						new error(400,JSON_WRONG_CALL_FORMAT);
						exit();
				}
			break;
			case "description":
				/*
				description
				  is                A fix description
				                      Folders.description is
				                      ItemFolderLinks.Items.description is
				  has               A part of a description
				                      Folders.description is
				                      ItemFolderLinks.Items.description is
				*/
				$tmpVal = mysql_real_escape_string($pattern["value"]);
				//check if the format of the pattern is correct
				switch($pattern["comparator"]){
					case "is":
						$subjectFlags["description"] = TRUE;
						$queryStrings["folders"]["description"]["is"] .= sprintf("(Folders.description = '%s') %s ",$tmpVal,$lg);
						$queryStrings["items"]["description"]["is"] .= sprintf("(Items.description = '%s') %s ",$tmpVal,$lg);
					break;
					case "has":
						$subjectFlags["description"] = TRUE;
						$queryStrings["folders"]["description"]["is"] .= sprintf("(Folders.description LIKE '%%%s%%') %s ",$tmpVal,$lg);
						$queryStrings["items"]["description"]["is"] .= sprintf("(Items.description LIKE '%%%s%%') %s ",$tmpVal,$lg);
					break;
					default:
						new error(400,JSON_WRONG_CALL_FORMAT);
						exit();
				}
			break;
			case "parentFolderId":
				/*
				parentFolderId
				  is                A fix parent Folder
				                      Folders.parentFolderId is
				                      ItemFolderLinks.folderId is
				*/
				$tmpVal = mysql_real_escape_string($pattern["value"]);
				//check if the format of the pattern is correct
				if($pattern["comparator"] == "is" AND is_numeric($pattern["value"])){
					$subjectFlags["parentFolderId"] = TRUE;
					$tmpVal = mysql_real_escape_string($pattern["value"]);
					$queryStrings["folders"]["parentFolderId"]["is"] .= sprintf("(Folders.parentFolderId = '%s') %s ",$tmpVal,$lg);
					$queryStrings["itemFolderLinks"]["parentFolderId"]["is"] .= sprintf("(ItemFolderLinks.folderId = '%s') %s ",$tmpVal,$lg);
				} else {
					new error(400,JSON_WRONG_CALL_FORMAT);
					exit();
				}
			break;
			case "path":
				/*
				path
				  has               Find a fix folder in the ancestors
				                      Folders.getPath() has
				                      ItemFolderLinks.getPath() has
				*/
				//check if the format of the pattern is correct
				if($pattern["comparator"] == "has"){
					$subjectFlags["path"] = TRUE;
					//note that pattern path cant be determined with other querystrings together; path is handeld seperatly later on
					$patternPath[] = $pattern["value"];
				} else {
					new error(400,JSON_WRONG_CALL_FORMAT);
					exit();
				}
			break;
			case "type":
				/*
				type
				  is                A fix type
				                      Folders.type is
				                      'item' is
				*/
				//note: determine if only items or folders should be shown
				//note: if type is experiment is set it needs type is folder too! otherwise there will be no folders and therefore no experiments
				$tmpVal = mysql_real_escape_string($pattern["value"]);
				//check if the format of the pattern is correct
				if($pattern["comparator"] == "is"){
					$subjectFlags["type"] = TRUE;
					//$patternType[$pattern["value"]] = TRUE;
					$patternType[$tmpVal] = TRUE;
				} else {
					new error(400,JSON_WRONG_CALL_FORMAT);
					exit();
				}
			break;
			case "ruleViolation":
				/*
				pattern: [{subject: 'ruleViolation',comparator: 'is not empty',value: ''}],
				*/
				//check if the format of the pattern is correct
				if($pattern["comparator"] == "is not empty"){
					//note that pattern violation cant be determined with other querystrings together; violation is handeld seperatly later on
					$subjectFlags["violation"] = TRUE;

				} else {
					new error(400,JSON_WRONG_CALL_FORMAT);
					exit();
				}
			break;
			//default is [freeProperty] (cf. patter.txt)
			default:
				/*
				[freeProperty] e.g. freePropertyValue4
				  is                A certain freePropertyValue
				                      ItemFolderLinks.Items.FreePropertyValue[id].value is
				  has               A part of a certain freePropertyValue
				                      ItemFolderLinks.Items.FreePropertyValue[id].value has
				*/
				$tmpVal = mysql_real_escape_string($pattern["value"]);
				//determine the FreePropertyValue id
				if(strstr($pattern["subject"], "freePropertyValue")){
					$idLength = strlen("freePropertyValue") - strlen($pattern["subject"]);
					$freePropertyValueId = substr($pattern["subject"], $idLength);
				} else {
					new error(400,JSON_WRONG_CALL_FORMAT);
					exit();
				}
				//check if the format of the pattern is correct
				switch($pattern["comparator"]){
					case "is":
						$subjectFlags["freeProperty"][] = $freePropertyValueId;
						$queryStrings["freePropertyValues"]["freeProperty"]["is"] .= sprintf("(FreePropertyValues.freePropertyId = '%s' AND
						 															FreePropertyValues.value = '%s' ) %s ",
																					$freePropertyValueId,$tmpVal,$lg);
					break;
					case "has":
						$subjectFlags["freeProperty"][] = $freePropertyValueId;
						$queryStrings["freePropertyValues"]["freeProperty"]["has"] .= sprintf("(FreePropertyValues.freePropertyId = '%s' AND
						 															FreePropertyValues.value LIKE '%%%s%%' ) %s ",
																					$freePropertyValueId,$tmpVal,$lg);
					break;
					default:
						new error(400,JSON_WRONG_CALL_FORMAT);
						exit();
				}
		}
	} else {
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}

}
//build the querys strings
$queryStrings["folders"]["final"]			 	= "";
$queryStrings["itemFolderLinks"]["final"]		= "";
$queryStrings["items"]["final"] 				= "";
$queryStrings["freePropertyValues"]["final"] 	= "";
//check for each pattern if it was used and if it was append to the appropriate query string
if($subjectFlags["any"] == TRUE){
	$queryStrings["folders"]["final"]			 	.= $queryStrings["folders"]["any"]["has"];
	$queryStrings["itemFolderLinks"]["final"]		.= $queryStrings["itemFolderLinks"]["any"]["has"];
	$queryStrings["items"]["final"] 				.= $queryStrings["items"]["any"]["has"];
	$queryStrings["freePropertyValues"]["final"] 	.= $queryStrings["freePropertyValues"]["any"]["has"];
}
if($subjectFlags["id"] == TRUE){
	$queryStrings["folders"]["final"]			 	.= $queryStrings["folders"]["id"]["is"];
	$queryStrings["items"]["final"] 				.= $queryStrings["items"]["id"]["is"];
}
if($subjectFlags["name"] == TRUE){
	$queryStrings["folders"]["final"]			 	.= $queryStrings["folders"]["name"]["is"];
	$queryStrings["items"]["final"] 				.= $queryStrings["items"]["name"]["is"];
	$queryStrings["folders"]["final"]			 	.= $queryStrings["folders"]["name"]["has"];
	$queryStrings["items"]["final"] 				.= $queryStrings["items"]["name"]["has"];
}
if($subjectFlags["description"] == TRUE){
	$queryStrings["folders"]["final"]				.= $queryStrings["folders"]["description"]["is"];
	$queryStrings["items"]["final"]					.= $queryStrings["items"]["description"]["is"];
	$queryStrings["folders"]["final"]				.= $queryStrings["folders"]["description"]["has"];
	$queryStrings["items"]["final"]					.= $queryStrings["items"]["description"]["has"];
}
if($subjectFlags["parentFolderId"] == TRUE){
	$queryStrings["folders"]["final"]				.= $queryStrings["folders"]["parentFolderId"]["is"];
	$queryStrings["itemFolderLinks"]["final"]		.= $queryStrings["itemFolderLinks"]["parentFolderId"]["is"];
}
if($subjectFlags["path"] == TRUE){
	//determine results from path pattern
	if($subjectFlags["path"] == TRUE){
		$pathFolders = array();
		foreach($patternPath as $path){
			$pathFolders = $pathFolders+$db->getAncestors($path);
			//add the folder which children are searched to the result
			$pathFolders[] = $path;
		}
	}
	$pathFolders = array_unique($pathFolders);
	//get all items in these folders
	foreach($pathFolders as $pathFolderId){
		$queryStrings["itemFolderLinks"]["final"] 	.= sprintf("(ItemFolderLinks.folderId = '%s' ) %s ",$pathFolderId,$lg);
	}
}
if($subjectFlags["violation"] == TRUE){
	//determine results from rule violation
	$vio = new violation();
	$violationItems = $vio->violatingItems();
}
if($subjectFlags["freeProperty"] == TRUE){
	$queryStrings["freePropertyValues"]["final"]	.= $queryStrings["freePropertyValues"]["freeProperty"]["is"];
	$queryStrings["freePropertyValues"]["final"]	.= $queryStrings["freePropertyValues"]["freeProperty"]["has"];
}
//finalize the querys
//determine how much too cut from the query string
if($lg == "AND"){
	$cut = -4;
} else {
	$cut = -3;
}
if($queryStrings["folders"]["final"] != ""){
	$queryStrings["folders"]["final"]			 	= "SELECT * FROM `Folders` WHERE ".substr($queryStrings["folders"]["final"], 0, $cut);
}
if($queryStrings["itemFolderLinks"]["final"] != ""){
	$queryStrings["itemFolderLinks"]["final"]		= "SELECT * FROM `ItemFolderLinks` WHERE "
													.substr($queryStrings["itemFolderLinks"]["final"], 0, $cut);
}
if($queryStrings["items"]["final"] != ""){
	$queryStrings["items"]["final"] 				= "SELECT * FROM `Items` WHERE ".substr($queryStrings["items"]["final"], 0, $cut);
}
if($queryStrings["freePropertyValues"]["final"] != ""){
	$queryStrings["freePropertyValues"]["final"] 	= "SELECT * FROM `FreePropertyValues` WHERE "
													.substr($queryStrings["freePropertyValues"]["final"], 0, $cut);
}
///////////////////////////////////
// for debugging:
//		echo "folders query: ".$queryStrings["folders"]["final"]."<br/>";
//		echo "itemFolderLinks query: ".$queryStrings["itemFolderLinks"]["final"]."<br/>";
//		echo "items query: ".$queryStrings["items"]["final"]."<br/>";
//		echo "freePropertyValues query: ".$queryStrings["freePropertyValues"]["final"]."<br/>";
///////////////////////////////////
//perform the querys and find all ids from folders and items which are in the result (every search returns folders oder items)
$queryResult = array();
$folderResultIds = array(); //array containing all found folder.ids
$itemResultIds = array(); //array containing all found item.ids
if($queryStrings["folders"]["final"] != ""){
	$queryResult["folders"] = mysql_query($queryStrings["folders"]["final"]);
	if(!$queryResult["folders"]){
		new error(500,MYSQL_QUERYERROR);
		exit();
	}
	if(mysql_num_rows($queryResult["folders"]) != 0){
		while($row = mysql_fetch_assoc($queryResult["folders"])){
			//$queryStrings["folders"]["final"] returns folder.ids
			$folderResultIds["folders"][] = $row["id"];
		}
	}
	mysql_free_result($queryResult["folders"]);
}
if($queryStrings["itemFolderLinks"]["final"] != ""){
	$queryResult["itemFolderLinks"] = mysql_query($queryStrings["itemFolderLinks"]["final"]);
	if(!$queryResult["itemFolderLinks"]){
		new error(500,MYSQL_QUERYERROR);
		exit();
	}
	if(mysql_num_rows($queryResult["itemFolderLinks"]) != 0){
		while($row = mysql_fetch_assoc($queryResult["itemFolderLinks"])){
			//$queryStrings["itemFolderLinks"]["final"] returns item.ids
			$itemResultIds["itemFolderLinks"][] = $row["itemId"];
		}
	}
	mysql_free_result($queryResult["itemFolderLinks"]);
}
if($queryStrings["items"]["final"] != ""){
	$queryResult["items"] = mysql_query($queryStrings["items"]["final"]);
	if(!$queryResult["items"]){
		new error(500,MYSQL_QUERYERROR);
		exit();
	}
	if(mysql_num_rows($queryResult["items"]) != 0){
		while($row = mysql_fetch_assoc($queryResult["items"])){
			//$queryStrings["items"]["final"] returns item.ids
			$itemResultIds["items"][] = $row["id"];
		}
	}
	mysql_free_result($queryResult["items"]);
}
if($queryStrings["freePropertyValues"]["final"] != ""){
	$queryResult["freePropertyValues"] = mysql_query($queryStrings["freePropertyValues"]["final"]);
	if(!$queryResult["freePropertyValues"]){
		new error(500,MYSQL_QUERYERROR);
		exit();
	}
	if(mysql_num_rows($queryResult["freePropertyValues"]) != 0){
		while($row = mysql_fetch_assoc($queryResult["freePropertyValues"])){
			//$queryStrings["freePropertyValues"]["final"] returns item.ids
			$itemResultIds["freePropertyValues"][] = $row["itemId"];
		}
	}
	mysql_free_result($queryResult["freePropertyValues"]);
}
///////////////////////////////////
// for debugging:
//		echo "result folders: ";
//		print_r($folderResultIds);
//		echo "<br/>";
//		echo "result path folders: ";
//		print_r($pathFolders);
//		echo "<br/>";
//		echo "result items: ";
//		print_r($itemResultIds);
//		echo "<br/>";
///////////////////////////////////
//combine the ResultId array depending on the logic operator
//if logic="AND" than the itemResultIds and $violationItems arrays must intersect same is true for $pathFolders and folderResultIds
//if logic="OR" than the itemResultIds and $violationItems arrays can be merged same is true for $pathFolders and folderResultIds

if(isset($folderResultIds["folders"]) AND $subjectFlags["path"] == TRUE){
	if($lg == "OR"){
		$folderResultIds["folders"] = array_merge($folderResultIds["folders"],$pathFolders);
		$folderResultIds["final"] = array_unique($folderResultIds["folders"]);
	} else {
		$folderResultIds["folders"] = array_intersect($folderResultIds["folders"],$pathFolders);
		$folderResultIds["final"] = array_unique($folderResultIds["folders"]);
	}
} elseif(isset($folderResultIds["folders"]) AND $subjectFlags["path"] == FALSE){
	$folderResultIds["final"] = array_unique($folderResultIds["folders"]);
} elseif(!isset($folderResultIds["folders"]) AND $subjectFlags["path"] == TRUE){
	$folderResultIds["final"] = array_unique($pathFolders);
} else {
	$folderResultIds["final"] = array();
}

if($lg == "AND"){
	//only intersect with not empty arrays
	$tmpCount = 0;
	$tmpKey = array();
	foreach($itemResultIds as $checkKey=>$checkArray){
		if(isset($checkArray)){
			$tmpCount++; //how many not empty arrays there are
			$tmpKey[] = $checkKey; //the stings of the keys of these not empty arrays
		}
	}
	if($tmpCount == 0){
		$itemResultIds["final"] = array();
	} else {
		$itemResultIds["final"] = $itemResultIds[$tmpKey[0]];
		$tmp = 1;
		while($tmp < $tmpCount){
			$itemResultIds["final"] = array_intersect($itemResultIds["final"],$itemResultIds[$tmpKey[$tmp]]);
			$tmp++;
		}
	}
	$itemResultIds["final"] = array_unique($itemResultIds["final"]);
} else {
	$itemResultIds["final"] = array();
	if(isset($itemResultIds["itemFolderLinks"])){
		$itemResultIds["final"] = array_merge($itemResultIds["final"],$itemResultIds["itemFolderLinks"]);
	}
	if(isset($itemResultIds["items"])){
		$itemResultIds["final"] = array_merge($itemResultIds["final"],$itemResultIds["items"]);
	}
	if(isset($itemResultIds["freePropertyValues"])){
		$itemResultIds["final"] = array_merge($itemResultIds["final"],$itemResultIds["freePropertyValues"]);
	}
	$itemResultIds["final"] = array_unique($itemResultIds["final"]);
}
//add violationItems to the result
if($subjectFlags["violation"] == TRUE){
	if($lg == "AND"){
		if($itemResultIds["final"]){
			$itemResultIds["final"] = array_intersect($itemResultIds["final"],$violationItems);
			$itemResultIds["final"] = array_unique($itemResultIds["final"]);
		} else{
			$itemResultIds["final"] = $violationItems;
		}
	} else {
		$itemResultIds["final"] = array_merge($itemResultIds["final"],$violationItems);
		$itemResultIds["final"] = array_unique($itemResultIds["final"]);
	}
}
///////////////////////////////////
// for debugging:
//		echo "final folders: ";
//		print_r($folderResultIds["final"]);
//		echo "<br/>";
//		echo "final items: ";
//		print_r($itemResultIds["final"]);
//		echo "<br/>";
///////////////////////////////////
//build the answer
$responseArray = array();
$responseArray["metaData"]["idProperty"] = "uid";
$responseArray["metaData"]["root"] = "records";
//get all freeProperties
$freePropertiesArray = array();
$freePropertyValueIdArray = array();
$fieldsArray = array();
$fieldsArray[] = array("name" => "uid",             "type" => "string",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "id",              "type" => "int",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "name",            "type" => "string",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "description",     "type" => "string",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "image",           "type" => "int",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "parentFolderId",  "type" => "int",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "itemFolderLinks", "type" => "auto",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "type",            "type" => "string",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "manualURL",       "type" => "string",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "homepageURL",     "type" => "string",		"defaultValue" => NULL);
$fieldsArray[] = array("name" => "ruleViolation",	"type" => "auto",		"defaultValue" => NULL);
$FPquery = "SELECT * FROM FreeProperties ORDER BY name";
$FPresult = mysql_query($FPquery);
if (!$FPresult){
	new error(500,MYSQL_QUERYERROR);
	exit();
}
while ($row = mysql_fetch_assoc($FPresult)) {
	$tempArray = array();
	$tempArray["id"] = (int) $row["id"];
	$fieldsArray[] = array("name" => "freePropertyValue".$row["id"], "type" => $row["format"], "defaultValue" => NULL);
	$tempArray["name"] = $row["name"];
	$tempArray["format"] = $row["format"];
	$tempArray["columnWidth"] = (int) $row["columnWidth"];
	$tempArray["mandatory"] = (bool) $row["mandatory"];
	$tempArray["unique"] = (bool) $row["unique"];
	$tempArray["notEmpty"] = (bool) $row["notEmpty"];
	$tempArray["readOnly"] = (bool) $row["readOnly"];
	$tempArray["afterToday"] = (bool) $row["afterToday"];
	$freePropertiesArray[] = $tempArray;
}
mysql_free_result($FPresult);
$responseArray["metaData"]["fields"] = $fieldsArray;
$responseArray["metaData"]["sortInfo"]["field"] = "name";
$responseArray["metaData"]["sortInfo"]["direction"] = "ASC";
$responseArray["metaData"]["freeProperties"] = $freePropertiesArray;
$total = 0;
$records = array();

//loop through all folders from $folderResultIds["final"] an build the answer
//determine id folders should be shown
//note: if type is experiment is set it needs type is folder too! otherwise there will be no folders and therefore no experiments
if($subjectFlags["type"] == TRUE){
	if(!isset($patternType["folder"])){
		$folderResultIds["final"] = array();
	}
}
foreach($folderResultIds["final"] as $folderId){
	$query = "SELECT * FROM Folders WHERE id = ".$folderId;
	$result = mysql_query($query);
	if (!$result){
		new error(500,MYSQL_QUERYERROR);
		exit();
	}
	if(mysql_num_rows($result)){
		$total++;
		while($row = mysql_fetch_assoc($result)){
			$temp = array();
			$temp["uid"] = "folder".$row["id"];
			$temp["id"] = (int) $row["id"];
			$temp["name"] = $row["name"];
			$temp["description"] = $row["description"];
			$temp["parentFolderId"] = (int) $row["parentFolderId"];
			$temp["image"] = (int) $row["image"];
			$temp["type"] = $row["type"];
			$temp["manualURL"] = $row["manualURL"];
			$temp["homepageURL"] = $row["homepageURL"];
			//$temp["ruleViolation"] = new stdClass();
			/*
			$typeDataTemp = json_decode($row["typeData"]);
			foreach($typeDataTemp as $key=>$value){
				//check if value is numeric
				if(is_numeric($value)){
					$temp[$key] = (int) $value;
				} else {
					$temp[$key] = $value;
				}
			}
			*/
			//determine if this folder should be shown
			//note: if type is experiment is set it needs type is folder too! otherwise there will be no folders and therefore no experiments
			if($subjectFlags["type"] == TRUE){
				if(!isset($patternType[$row["type"]])){
					$temp = array();
					$total--;
				} else {
					$records[] = $temp;
				}
			} else {
				$records[] = $temp;
			}
		}
	}
	mysql_free_result($result);
}
//loop through all items from $itemResultIds["final"] an build the answer
//determine id items should be shown
if($subjectFlags["type"] == TRUE){
	if(!isset($patternType["item"])){
		$itemResultIds["final"] = array();
	}
}
foreach($itemResultIds["final"] as $itemId){
	$query = "SELECT * FROM Items WHERE id = ".$itemId;
	$result = mysql_query($query);
	if (!$result){
		new error(500,MYSQL_QUERYERROR);
		exit();
	}
	if(mysql_num_rows($result)){
		$total++;
		while($row = mysql_fetch_assoc($result)){
			$temp = array();
			$temp["uid"] = "item".$row["id"];
			$temp["id"] = (int) $row["id"];
			$temp["type"] = "item";
			$temp["name"] = $row["name"];
			$temp["description"] = $row["description"];
			$temp["image"] = (int) $row["image"];
			$violation = new violation();
			$temp["ruleViolation"] = $violation->oneItemViolation($row["id"],$db);
			$queryFolderId = "SELECT folderId FROM ItemFolderLinks WHERE itemId = ".$row["id"];
			$resultFolderId = mysql_query($queryFolderId);
			if (!$resultFolderId){
				new error(500,MYSQL_QUERYERROR);
				exit();
			}
			$tempLinks = array(); //unsorted array of itemFolderLinks
			if(mysql_num_rows($resultFolderId)){
				while($folderLink = mysql_fetch_assoc($resultFolderId)){
					$tempLinks["itemFolderLinks"][] = (int) $folderLink["folderId"];
				}
			} else {
				$tempLinks["itemFolderLinks"] = array();
			}
			mysql_free_result($resultFolderId);
			//construct the sorted itemFolderLinks array
			if(!empty($tempLinks["itemFolderLinks"])){
				$queryFolderLinks = "SELECT id,type,name FROM Folders WHERE (";
				foreach($tempLinks["itemFolderLinks"] as $tmpFolderLinkId){
					$queryFolderLinks .= " id = ".$tmpFolderLinkId. " OR ";
				}
				$queryFolderLinks = substr($queryFolderLinks, 0, -3);
				$queryFolderLinks .= ") ORDER BY type, name";
			}
			$resultFolderLinks = mysql_query($queryFolderLinks);
			if (!$resultFolderLinks){
				new error(500,MYSQL_QUERYERROR);
				exit();
			}
			if(mysql_num_rows($resultFolderLinks)){
				while($folderLink = mysql_fetch_assoc($resultFolderLinks)){
					$temp["itemFolderLinks"][] = (int) $folderLink["id"];
				}
			} else {
				$temp["itemFolderLinks"] = array();
			}
			mysql_free_result($resultFolderLinks);
			$queryFreeProperty = "SELECT freePropertyId,value FROM FreePropertyValues WHERE itemId = ".$row["id"];
			$resultFreeProperty = mysql_query($queryFreeProperty);
			if (!$resultFreeProperty){
				new error(500,MYSQL_QUERYERROR);
				exit();
			}
			if(mysql_num_rows($resultFreeProperty)){
				while($FP = mysql_fetch_assoc($resultFreeProperty)){
					//check if that freeProperty is numeric
					foreach($fieldsArray  as $testkey=>$testvalue){
						if($testvalue["name"] == "freePropertyValue".$FP["freePropertyId"]){
							if($testvalue["type"] == "int"){
								$temp["freePropertyValue".$FP["freePropertyId"]] = (int) $FP["value"];
							} else {
								$temp["freePropertyValue".$FP["freePropertyId"]] = $FP["value"];
							}
						}
					}
				}
			}
			mysql_free_result($resultFreeProperty);
			$records[] = $temp;
		}
	}
	mysql_free_result($result);
}

$success = TRUE;

$responseArray["success"] = $success;
$responseArray["total"] = (int) $total;
if($total != 0){
	$responseArray["records"] = $records;
} else {
	$responseArray["records"] = array();
}

//get version
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//##############################
//detrmine if response is needed for getAsReport.php
if($report == true){
	$reportResonse = array();
	foreach($responseArray["records"] as $entry){
		if($entry["type"] == "item"){
			$reportResonse["items"][] = $entry["id"];
		} else{
			$reportResonse["folders"][] = $entry["id"];
		}
	}
	
	/*
	$tmpReport = array();
	
	foreach($folderResultIds["final"] as $idReport){
		$tmpReport[] = $idReport;
	}
	$reportResonse["folders"] = $tmpReport;
	$tmpReport = array();
	unset($idReport);
	foreach($itemResultIds["final"] as $idReport){
		$tmpReport[] = $idReport;
	}
	$reportResonse["items"] = $tmpReport;
	*/
	if($reportResonse != NULL){
		echo json_encode($reportResonse);
	} else {
		echo "{}";
	}
	exit();
}

//send the response
$json->sendResponse($responseArray);

?>