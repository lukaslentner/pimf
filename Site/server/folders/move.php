<?php

/*
moves folders into other folders

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"
}

data:
{
	"ids":[18,19,21],
	"newParentFolderId":16
}
answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/folders/move.php?data={"ids":[18,19,21],"newParentFolderId":16}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}
or: http://localhost/PIMF/trunk/server/folders/move.php?data={"ids":[14],"newParentFolderId":15}&login={"username":"Lukas.Lentner","password":"315eb983645c4ae0b29655da27df3f9ff73a90d8","role":2}
*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids","newParentFolderId");
$json->checkKeys($needed);

$ids = $call["ids"];

//perform some checks
if(!is_numeric($call["newParentFolderId"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}
foreach($call["ids"] as $key=>$value){
	if(!is_numeric($value)){
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}
	$queryIds = $db->queryOneRow(array("parentFolderId","type"), "Folders", "id", $value);
	$queryNewId = $db->queryOneRow(array("type"), "Folders", "id", $call["newParentFolderId"]);
	//check that folders with parentFolderId = 0 are not moved
	if($queryIds["parentFolderId"] == "0"){
		new error(400,OTHER_FOLDER_ZERO_MOVE);
		exit();
	}
	//check that folders are only moves into folders with same type
	if($queryNewId["type"] == $queryIds["type"]){
		//check if one of the ids is the child of the currently checked id; if so the child does not need to me moved
		/*
		$db->getAllFolders($value);
		$children = array();
		$children = $db->returnAllFolders();
		unset($children[0]);
		if(array_intersect($children,$ids) == array($value)){
			unset($ids[$key]);
		}
		*/
		$children = array();
		$db->getAllChildren($value);
		$children = $db->returnAllChildren();
		//check that parent is not moved into child
		foreach($children as $childId){
			if($childId == $call["newParentFolderId"]){
				new error(400,OTHER_MOVE_FAMILY);
				exit();
			}
		}
		
	} else {
		new error(400,OTHER_MOVE_TYPE);
		exit();
	}
}
//perform the move
foreach($ids as $id){
	$db->updateOneRow("Folders", array("parentFolderId" => $call["newParentFolderId"]),"id",$id);
}

//increase the version number and return the new version number
$responseArray = array();
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>