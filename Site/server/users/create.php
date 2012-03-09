<?php

/*
create new users

call has to look like:

login:
{
		"username":"guest",
		"password":"guest"
}

data:
{
	"username":"Lukas",
	"password":"da39a3ee5e6b4b0d3255bfef95601890afd80709",
	"role":"1"
}

answer looks like:
{
	"id":"userid"
	"version":123
}

example: http://localhost/PIMF/trunk/server/users/create.php?data={"username":"Tester","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709","role":"1"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(2,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("username","password","role");
$json->checkKeys($needed);
	
//check if user with that username already exists
$query = $db->queryOneRow(array("username","password","role"), "Users", "username", $call["username"]);
if($query["username"] OR $call["username"] == ""){
	new error(400,USER_NAME);
	exit();
} else {
	//check if the password is not empty
	if($call["password"] == sha1("")){
		new error(400,USER_PASSWORD);
		exit();
	} else {
		$responseArray["id"] = $db->insertOneRow("Users", $call);
		
		//increase the version number and return the new version number
		$db->increaseVersion();
		$version = new version();
		$responseArray["version"] = (int) $version->returnVersion();
		
		//send the response
		$json->sendResponse($responseArray);
	}
}

?>