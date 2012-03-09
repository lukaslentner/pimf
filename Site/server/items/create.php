<?php

/*
create new items

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"
}

data:
{
	"name":"name",
	"description":"description",
	"itemFolderLinks":[3,4,5],
	"freePropertyValue3":"2m",
	"freePropertyValue2":"3m",
	"image":"123"
}

answer looks like:
{
	"id": "2"
	"version":123
}

example: http://localhost/PIMF/trunk/server/items/create.php?data={"name":"Zahnstocher","description":"","image":"1","itemFolderLinks":[35,22,23],"freePropertyValue3":"2m","freePropertyValue4":"1234"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("name","description","itemFolderLinks","image");
$json->checkKeys($needed);

$responseArray = array();

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
//editor can create an item with readonly free Property if that value is NULL
if($user->returnPrivilege() == 1){
		foreach($tmp["freePropertyValues"] as $key=>$value){
			$test = $db->queryOneRow(array("readOnly"), "FreeProperties", "id", $value["freePropertyId"]);
			if($test["readOnly"] == 1 AND $value["value"] != NULL){
				new error(400,OTHER_READ_ONLY);
				exit();
			}
			//check if freeProperty does exist
			if($test["readOnly"] == NULL){
				new error(400,OTHER_ITEM_PROP_NOT_EXIST);
				exit();
			}
		}
}

//check if all folders exist
if(is_array($call["itemFolderLinks"])){
	if(!empty($call["itemFolderLinks"])){
		foreach($call["itemFolderLinks"] as $key=>$value){
			$test = $db->queryOneRow(array("name"),"Folders", "id",$value);
			if($test["name"] === NULL){
				new error(400,OTHER_ITEM_FOLDER_NOT_EXIST);
				exit();
			}
		}
	}
}

$query["id"] = $db->insertOneRow("Items", array("name"=>$call["name"],"description"=>$call["description"],"image"=>$call["image"]));
$responseArray['id'] = (int) $query["id"];

if(is_array($call["itemFolderLinks"])){
	if(!empty($call["itemFolderLinks"])){
		foreach($call["itemFolderLinks"] as $key=>$value){
			$db->insertOneRow("ItemFolderLinks", array("itemId"=>$query["id"],"folderId"=>$value));
		}
	}
} else {
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}
if(is_array($tmp["freePropertyValues"])){
	foreach($tmp["freePropertyValues"] as $key=>$value){
		$db->insertOneRow("FreePropertyValues", array("itemId"=>$query["id"],"freePropertyId"=>$value["freePropertyId"],"value"=>$value["value"]));
	}
} else {
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

//increase the version number and return the new version number
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>