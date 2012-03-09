<?php

/*
rename image

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"
}

data:
{
	"id":"1"
	"name":"neuername"
}
answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/images/update.php?data={"id":"1","name":"neuername"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("id","name");
$json->checkKeys($needed);

if(!is_numeric($call["id"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

//check if image with that id exists
$test = $db->queryOneRow(array("name"),"Images","id",$call["id"]);
if($test["name"] === NULL){
	new error(400,IMAGE_NOT_EXISTS);
	exit();
}

$db->updateOneRow("Images",array("name"=>$call["name"]),"id",$call["id"]);

//increase the version number and return the new version number
$responseArray = array();
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>
