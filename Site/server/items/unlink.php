<?php

/*
unlink a folder with different items

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"	
}

data:
{
"ids":["6","7","8"],
"oldLinkFolderId":"35"
}

answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/items/unlink.php?data={"ids":["6","7","8"],"oldLinkFolderId":"35"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids","oldLinkFolderId");
$json->checkKeys($needed);

if(!is_numeric($call["oldLinkFolderId"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}
	
foreach($call["ids"] as $itemId){
		$query = sprintf("DELETE FROM ItemFolderLinks WHERE (itemId = '%s' AND folderId = '%s')",mysql_real_escape_string($itemId),mysql_real_escape_string($call["oldLinkFolderId"]));
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
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