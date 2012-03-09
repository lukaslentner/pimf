<?php

/*
create new folders

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"
}

data:
{
	"name":"name",
	"parentFolderId":123,
	"description":"description",
	"type":"type",
	"manualURL":"",
	"homepageURL":""
	"image":1
}

answer looks like:
{
	"id": 23
	"version":123
}

example: http://localhost/PIMF/trunk/server/folders/create.php?data={"name":"Zahn1337","parentFolderId":19,"description":"asde","type":"experiment","manualURL":"","homepageURL":"","image":1}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/


//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("name","parentFolderId","description","type","manualURL","homepageURL","image");
$json->checkKeys($needed);

//create the new folder
$responseArray["id"] = (int) $db->insertOneRow("Folders", $call);

//increase the version number and return the new version number
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>