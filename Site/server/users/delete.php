<?php

/*
delete users

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"
}

data:
{
	"ids":["6","5"]
}
answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/users/delete.php?data={"ids":["6","5"]}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(2,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids");
$json->checkKeys($needed);

//check if users exist
foreach($call["ids"] as $key=>$value){
	if(!is_numeric($value)){
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}
	$test = $db->queryOneRow(array("username"),"Users","id", $value);
	if($test["username"] === NULL){
		new error(400,USER_NOT_EXIST);
		exit();
	}
}
foreach($call["ids"] as $key=>$value){
	$db->deleteOneRow("Users","id", $value);
}

$responseArray = array();

//increase the version number and return the new version number
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>

