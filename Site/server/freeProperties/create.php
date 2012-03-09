<?php

/*
create new free Properties

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"
}

data:
{
	"name":"name",
	"format":"format",
	"columnWidth":"columnWidth",
	"mandatory":"0",
	"unique":"0",
	"notEmpty":"0",
	"readOnly":"0",
	"afterToday":"0"
}


answer looks like:
{
	"id":"id"
	"version":123
}

example: http://localhost/PIMF/trunk/server/freeProperties/create.php?data={"name":"BrennweiteTest","format":"text","columnWidth":"123","mandatory":"0","unique":"TRUE","notEmpty":"FALSE","readOnly":"0","afterToday":"0"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("name","format","columnWidth","mandatory","unique","notEmpty","readOnly","afterToday");
$json->checkKeys($needed);

//check if the name of the freePoperty is already in use (the query returns NULL if the result of the query is empty)
$query = $db->queryOneRow(array("id"), "FreeProperties", "name", $call["name"]);
if($query == NULL){
	//create new freeProperty
	$responseArray["id"] = (int) $db->insertOneRow("FreeProperties", $call);
	
	//increase the version number and return the new version number
	$db->increaseVersion();
	$version = new version();
	$responseArray["version"] = (int) $version->returnVersion();
	
	//send the response
	$json->sendResponse($responseArray);
} else {
	new error(400,OTHER_FREEPROPERTYNAME_EXISTS);
	exit();
}

?>