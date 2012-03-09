<?php

/*
delete folders and all its subfolders and delete all links to these folders in ItemFolderLinks

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"
}

data:
{
	"ids":[6,5]
}
answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/folders/delete.php?data={"ids":[6,5]}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids");
$json->checkKeys($needed);

$deleteid = array();
$ids = array();
foreach($call["ids"] as $key=>$value){
	if(!is_numeric($value)){
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}
	//check that folders with parentFolderId = 0 are not deleted
	$parentFolderId = $db->queryOneRow(array("parentFolderId"), "Folders", "id", $value);
	if($parentFolderId["parentFolderId"] == "0"){
		new error(400,OTHER_FOLDER_ZERO);
		exit();
	}
	if($parentFolderId["parentFolderId"] == ""){
		new error(400,OTHER_FOLDER_NOT_EXIST);
		exit();
	}
	//calculate the array that contains the folder id and all the subfolder ids of the folder thats beeing deleted in this loop
	$db->getAllFolders($call["ids"][$key]);
	$ids = $db->returnAllFolders();
	$deleteid = array_merge($deleteid,$ids);
}
$deleteid = array_unique($deleteid);
foreach($deleteid as $id){
	$db->deleteOneRow("Folders","id", $id); //delete the folders
	$db->deleteOneRow("ItemFolderLinks","folderId", $id); //delete the Item Folder Links
}

$responseArray = array();

//increase the version number and return the new version number
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>
