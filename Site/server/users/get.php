<?php

/*
show all users

call has to look like:

login:
{
		"username":"",
		"password":""
}

data:{}

answer looks like:
{
  "success": true,
  "total": 4,
  "records": [
    {
      id: '21',
      username: 'Lukas.Lentner',
      password: 'PW',
      role: '2'
    },
    {
      id: '22',
      username: 'Mihi',
      password: 'PW',
      role: '2'
    },
    {
      id: '23',
      username: 'Jürgen',
      password: 'PW',
      role: '2'
    },
    {
      id: '24',
      username: 'Tutor',
      password: 'PW',
      role: '1'
    }
  ]
	  "version":17
}

example: http://localhost/PIMF/trunk/server/users/get.php?data={}&login={"username":"Lukas.Lentner","password":"315eb983645c4ae0b29655da27df3f9ff73a90d8","role":"2"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(2,false,$user,$lock);

$returnArray = array();
$returnArray["success"] = TRUE;
$returnArray["records"] = array();
$query = "SELECT * FROM Users";
$result = mysql_query($query);
if (!$result){
	new error(500,MYSQL_QUERYERROR);
	exit();
}
$returnArray["total"] = mysql_num_rows($result);

while ($row = mysql_fetch_assoc($result)) {
	$tempArray = array();
	$tempArray["id"] = (int) $row["id"];
	$tempArray["username"] = $row["username"];
	$tempArray["password"] = $row["password"];
	$tempArray["role"] = (int) $row["role"];
	$returnArray["records"][] = $tempArray;
}

mysql_free_result($result);

//get version
$version = new version();
$returnArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($returnArray);

?>