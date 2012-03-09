<?php

/*
unlock the table

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"
}

data:
{}
answer looks like:
{}

example: http://localhost/PIMF/trunk/server/lock/delete.php?data={}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,false,$user,$lock);

//check if db is not already unlocked
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

if($lockId != 0){
	//check if that user has the privilege to perform this action (only unlock own lock!)
	if($lockId == $user->returnId()){
		//unlock the db
		$db->updateOneRow("Misc", array("lock" => 0),"1","1");
		
		//get version number
		$version = new version();
		$responseArray["version"] = (int) $version->returnVersion();
	
		//send the response
		$json->sendResponse(NULL);
	} 
	/* //removed so client has no problems
	else {
		//get the name of the user that locked the db
		$name = $db->queryOneRow(array("username"),"Users","id",$lockId);
		new error(400,LOCK_UNLOCK_ERROR_FIRST.$name["username"].LOCK_UNLOCK_ERROR_SECOND);
		exit();
	}
	*/
}

?>