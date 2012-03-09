<?php

/*
return all images

call has to look like:
data:
{
	"id":32 //search for id OR
	"search":"sometext" //if search is empty ("search":"" NOT "search":null) return all images
}

login:
{
	"username":"",
	"password":""
}



answer looks like:

{
	"success":true,
	"total":1,
	"records":[
		{id: 1, name: "NameTEST"}
		...
		],
	"version":13
}


example: http://localhost/PIMF/trunk/server/images/get.php?data={"search":"test"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(0,false,$user,$lock);

$responseArray = array();
$responseArray['success'] = TRUE;
$responseArray['total'] = 0;
$responseArray['records'] = array();

if(isset($call["search"])){
	if($call["search"] == ""){
		$query = "SELECT * FROM Images";
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$responseArray['records'][] = array('id' => (int) $row["id"],'name' => $row["name"]);
			$responseArray['total']++;
		}
	} else {
		$query = sprintf("SELECT * FROM Images WHERE Images.name LIKE '%%%s%%'", mysql_real_escape_string($call["search"]));
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$responseArray['records'][] = array('id' => (int) $row["id"],'name' => $row["name"]);
			$responseArray['total']++;
		}
	}
}

if(isset($call["id"])){
	if(!is_numeric($call["id"])){
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}
	$query = sprintf("SELECT * FROM Images WHERE Images.id = '%s'", mysql_real_escape_string($call["id"]));
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$responseArray['records'][] = array('id' => (int) $row["id"],'name' => $row["name"]);
			$responseArray['total']++;
		}	
}

//get version
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>