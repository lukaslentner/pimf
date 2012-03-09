<?php

/*
update folders

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"
}

data:
{
	"id":12,
	"name":"name",
	"parentFolderId":23,
	"description":"description",
	"type":"type",
	"manualURL":"",
	"homepageURL":""
	"image":1
}
answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/folders/update.php?data={"id":21,"name":"Zahn123","parentFolderId":19,"description":"","type":"experiment",	"manualURL":"www.test.de","homepageURL":"blah","image":1}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("id","name","parentFolderId","description","type","manualURL","homepageURL","image");
$json->checkKeys($needed);

//increase the version number and return the new version number
if(!is_numeric($call["id"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}
$db->updateOneRow("Folders", $call,"id",$call["id"]);
$responseArray = array();
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>
