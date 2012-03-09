<?php

/*
link a folder with different items

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"
}

data:
{
"ids":[6,7,8],
"newLinkFolderId":"35"
}

answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/items/link.php?data={"ids":["6","7","8"],"newLinkFolderId":"35"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids","newLinkFolderId");
$json->checkKeys($needed);

if(!is_numeric($call["newLinkFolderId"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

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
//check if folder exist
$test = $db->queryOneRow(array("name"),"Folders", "id",$call["newLinkFolderId"]);
if($test["name"] === NULL){
	new error(400,OTHER_FOLDER_NOT_EXIST);
	exit();
}



foreach($call["ids"] as $itemId){
	//check if the item is already linked with the folder
	$test = $db->queryOneRow(array("folderId"),"ItemFolderLinks", "itemId",$itemId);
	if($test["folderId"] != $call["newLinkFolderId"]){
		$db->insertOneRow("ItemFolderLinks", array("itemId"=>$itemId,"folderId"=>$call["newLinkFolderId"]));
	}
}

$responseArray = array();

//increase the version number and return the new version number
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>