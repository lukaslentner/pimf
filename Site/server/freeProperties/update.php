<?php

/*
update free Properties

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"	
}

data:
{
	"id":"id"
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
	"version":123
}

example: http://localhost/PIMF/trunk/server/freeProperties/update.php?data={"id":"15","name":"anderername","format":"text","columnWidth":"123","mandatory":"0","unique":"0","notEmpty":"0","readOnly":"0","afterToday":"0"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(2,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("id","name","format","columnWidth","mandatory","unique","notEmpty","readOnly","afterToday");
$json->checkKeys($needed);

if(!is_numeric($call["id"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

//check if the name of the freePoperty is already in use
$query = sprintf("SELECT * FROM `FreeProperties` WHERE `id` != '%s' AND `name` = '%s'", mysql_real_escape_string($call["id"]), mysql_real_escape_string($call["name"]));
$result = mysql_query($query);
if (!$result){
	new error(500,MYSQL_QUERYERROR);
	exit();
}
$num_rows = mysql_num_rows($result);		
if($num_rows == NULL){
	//update the freeProperty
	$db->updateOneRow("FreeProperties", $call,"id",$call["id"]);
	
	//increase the version number and return the new version number
	$responseArray = array();
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