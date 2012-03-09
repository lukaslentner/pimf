<?php

/*
delete items

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"
}

data:
{
		"ids":["9","10"]
}

answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/items/delete.php?data={"ids":["9","10"]}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids");
$json->checkKeys($needed);

//check if all items exist
if(is_array($call["ids"])){
	if(!empty($call["ids"])){
		foreach($call["ids"] as $key=>$value){
			if(!is_numeric($value)){
				new error(400,JSON_WRONG_CALL_FORMAT);
				exit();
			}
			$test = $db->queryOneRow(array("name"),"Items", "id",$value);
			if($test["name"] === NULL){
				new error(400,OTHER_ITEM_NOT_EXIST);
				exit();
			}
		}
	}
}
foreach($call["ids"] as $key=>$value){
	$db->deleteOneRow("Items","id", $value); //delete the item
	$db->deleteOneRow("FreePropertyValues","ItemId", $value); //delete the free PropertyValues
	$db->deleteOneRow("ItemFolderLinks","ItemId", $value); //delete the item folder links
}

//increase the version number and return the new version number
$responseArray = array();
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>
