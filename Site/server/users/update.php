<?php

/*
update users

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"	
}

data:
{
	"id":"6"
	"username":"ADSF",
	"password":"da39a3ee5e6b4b0d3255bfef95601890afd80709",
	"role":"1"
}
answer looks like:
{
	"version":123
}

example: http://localhost/PIMF/trunk/server/users/update.php?data={"id":"4","username":"Tsssss","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709","role":"2"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(2,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("id","username","password","role");
$json->checkKeys($needed);

if(!is_numeric($call["id"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

//check if users exist
$test = $db->queryOneRow(array("username"),"Users","id", $call["id"]);
if($test["username"] === NULL){
	new error(400,USER_NOT_EXIST);
	exit();
}

$query = $db->queryOneRow(array("id","username","password","role"), "Users", "username", $call["username"]);
//check if the user with id = call["id"] has its username changed
if($query["id"] == $call["id"] OR !$query["id"]){
	if($call["username"] == ""){
		new error(400,USER_NAME);
		exit();
	} else {
		//check if the password is not empty
		if($call["password"] == sha1("")){
			new error(400,USER_PASSWORD);
			exit();
		} else {
			$db->updateOneRow("Users", $call,"id",$call["id"]);
			$responseArray = array();
			
			//increase the version number and return the new version number
			$db->increaseVersion();
			$version = new version();
			$responseArray["version"] = (int) $version->returnVersion();

			//send the response			
			$json->sendResponse($responseArray);
		}
	}
} else {
	new error(400,USER_NAME);
	exit();			
}

?>

