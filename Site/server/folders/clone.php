<?php

/*
clone folders with all content in it (all folders and subfolders and items in there folders)

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"
}

data = {
  ids: [2,3],
  count: 3
}

answer looks like:
{
  ids: [
    [5,6,7], //for id=2
    [8,9,10] //for id=3
  ]
}

example: http://localhost/PIMF/trunk/server/folders/clone.php?data={"ids":[2,3],"count":"3"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids","count");
$json->checkKeys($needed);

//check that parentfolder is not 0 (cannot clone a root folder) and that all folders exist
$cloneIds = array();
if(!is_numeric($call["count"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}
foreach($call["ids"] as $id){
	if(!is_int($id)){
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}
	$cloneIds[] = $id;
	$parentFolderId = $db->queryOneRow(array("parentFolderId"), "Folders", "id", $id);
	//check if all folders exist
	if($parentFolderId == NULL){
		new error(400,OTHER_FOLDER_NOT_EXIST);
		exit();
	}
	if($parentFolderId["parentFolderId"] == "0"){
		new error(400,OTHER_FOLDER_ZERO_CLONE);
		exit();
	}
}

$responseArray["ids"] = array();

//perform the cloning
foreach($cloneIds as $cloneId){
	//check if type of cloneId is location (only locations may be cloned; note that other types would work too, but user may not want the result (the items in the cloned folder would be copyed and so two real items of the same sort would exist...))
	$check = $db->queryOneRow(array("type"), "Folders", "id", $cloneId);
	if($check["type"] != "location"){
	new error(400,OTHER_CLONE_LOCATION);
		exit();
	}
	$tmp = array();
	for($i=0;$i < $call["count"]; $i++){
		$tmp[] = $db->cloneFolder($cloneId,0); //clone folder with everything in it, return its new folderId				
	}
	$responseArray["ids"][] = $tmp;
}

//increase the version number and return the new version number
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>