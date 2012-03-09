<?php

/*
locks the table for a certain user

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"
}

data:
{
  "adminOverwrite": true
}
answer looks like:
{}

example: http://localhost/PIMF/trunk/server/lock/create.php?data={}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,false,$user,$lock);

//check if db is not already locked
$query = "SELECT * FROM Misc";

$result = mysql_query($query);
if (!$result){
	new error(500,MYSQL_QUERYERROR);
	exit();
}

if(mysql_num_rows($result)){
	while($row = mysql_fetch_assoc($result)){
	 	$lockId = $row["lock"];
	}
} else {
	new error(500,MYSQL_QUERYERROR);
	exit();
}

if($lockId == 0){
	//lock the db for that user
	$db->updateOneRow("Misc", array("lock" => $user->returnId()),"1","1");
	
	//get version number
	$version = new version();
	$responseArray["version"] = (int) $version->returnVersion();

	//send the response
	$json->sendResponse(NULL);
} else {
	if($lockId == $user->returnId()) {
		$json->sendResponse(NULL);
	} else if($call['adminOverwrite'] AND $user->returnPrivilege() == 2) {
		$db->updateOneRow("Misc", array("lock" => $user->returnId()),"1","1");
		
		//get version number
		$version = new version();
		$responseArray["version"] = (int) $version->returnVersion();
			
		//send the response
		$json->sendResponse(NULL);
	} else {
		//get the name of the user that locked the db
		$name = $db->queryOneRow(array("username"),"Users","id",$lockId);
		new error(400,LOCK_ALREADY_LOCKED_FIRST.$name["username"].LOCK_ALREADY_LOCKED_SECOND);
		exit();
	}
}

?>