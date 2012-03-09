<?php

/*
update items

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"
}

data:
{

    		"id": "id",
			"name":"name",
			"description":"description",
			"image":"1234"
			"itemFolderLinks":[3,4,5],
			"freePropertyValue3":"2m",
			"freePropertyValue2":"3m",
	]
}

answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/items/update.php?data={"id":"22","name":"Zahnstocher2k","description":"","image":"1","itemFolderLinks":[35,22,23,31],"freePropertyValue2":"5555","freePropertyValue3":"7777"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("id","name","description","itemFolderLinks","image");
$json->checkKeys($needed);

if(!is_numeric($call["id"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

//loop through the call an get all freePropertyValues
$tmp["freePropertyValues"] = array();
foreach($call as $k=>$v){
	if(strstr($k, 'freePropertyValue')){
		$temp = explode('freePropertyValue',$k);
		if(!is_numeric($temp[1])){
			new error(400,JSON_WRONG_CALL_FORMAT);
			exit();
		}
		$tmp["freePropertyValues"][] = array("freePropertyId"=>$temp[1], "value"=>$v);
	}
}

//check if one of the FreeProperties is on readonly. If it is readonly only an admin can set/update that freePropertyValue
//-> if user is editor (priviledge = 1) than check if the call should be processed
if($user->returnPrivilege() == 1){
		
			foreach($tmp["freePropertyValues"] as $k=>$v){
				$test = $db->queryOneRow(array("readOnly"), "FreeProperties", "id", $v["freePropertyId"]);
				if($test["readOnly"] == 1){
					//the editor can modify the item if the freeProperty that has read only is not changed
					$testQuery =  sprintf("SELECT * FROM FreePropertyValues WHERE itemId = '%s' AND freePropertyId = '%s' ",mysql_real_escape_string($call["id"]),mysql_real_escape_string($v["freePropertyId"]));
					$testResult = mysql_query($testQuery);
					if (!$testResult){
						new error(500,MYSQL_QUERYERROR);
						exit();
					}
					
					if(mysql_num_rows($testResult)){
						while($row = mysql_fetch_assoc($testResult)){
							if($row["value"] != $v["value"]){
								new error(400,OTHER_READ_ONLY);
								exit();	
							}
						}
					}
				}
			}
}

//check if all item ids exist
$test = $db->queryOneRow(array("name"),"Items", "id",$call["id"]);
if($test["name"] === NULL){
	new error(400,OTHER_ITEM_NOT_EXIST);
	exit();
}


//check if all folders exist

if(is_array($call["itemFolderLinks"])){
	if(!empty($call["itemFolderLinks"])){
		foreach($call["itemFolderLinks"] as $k=>$v){
			$test = $db->queryOneRow(array("name"),"Folders", "id",$v);
			if($test["name"] === NULL){
				new error(400,OTHER_ITEM_FOLDER_NOT_EXIST);
				exit();
			}
		}
	}
}



//$db->deleteOneRow("Items","id", $call["id"]); //delete the item
$db->deleteOneRow("FreePropertyValues","ItemId", $call["id"]); //delete the free PropertyValues
$db->deleteOneRow("ItemFolderLinks","ItemId", $call["id"]); //delete the item folder links
//$db->insertOneRow("Items", array("name"=>$call["name"],"description"=>$call["description"]));
//$query = $db-> queryOneRow("id", "Items", "name", $call["name"]);
//$query['id'] = $call["id"];
//mysql_query("UPDATE Items SET name='".$call["name"]."', description='".$call["description"]."', image='".$call["image"]."' WHERE id=".$call["id"]);
$db->updateOneRow("Items", array("name"=>$call["name"],"description"=>$call["description"],"image"=>$call["image"]),"id",$call["id"]);
if(is_array($call["itemFolderLinks"])){
	if(!empty($call["itemFolderLinks"])){
		foreach($call["itemFolderLinks"] as $k=>$v){
			$db->insertOneRow("ItemFolderLinks", array("itemId"=>$call["id"],"folderId"=>$v));
		}
	}
} else {
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

if(is_array($tmp["freePropertyValues"])){
	foreach($tmp["freePropertyValues"] as $k=>$v){
		$db->insertOneRow("FreePropertyValues", array("itemId"=>$call["id"],"freePropertyId"=>$v["freePropertyId"],"value"=>$v["value"]));
	}
} else {
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

$responseArray = array();

//increase the version number and return the new version number
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();


//send the response
$json->sendResponse($responseArray);

?>