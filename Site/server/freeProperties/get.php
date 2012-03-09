<?php

/*
show all freeProperties

call has to look like:

login:
{
		"username":"eas",
		"password":"sss"
}

data:{}

answer looks like:
{
  "success": true,
  "total": 4,
  "records": [
    {
		id: "1",
		name: "Fehler in m",
      	format: "text",
      	columnWidth: "50"
		"columnWidth":123,
		"mandatory":false,
		"unique":false,
		"notEmpty":false,
		"readOnly":false,
		"afterToday":false
    },
    {
      id: "2",
      name: "Bild",
      format: "image",
      columnWidth: "100"
		"mandatory":false,
		"unique":false,
		"notEmpty":false,
		"readOnly":false,
		"afterToday":false
    },
    {
      id: "3",
      name: "test1",
      format: "dfgsdf",
      columnWidth: "12"
		"mandatory":false,
		"unique":false,
		"notEmpty":false,
		"readOnly":false,
		"afterToday":false
    },
    {
      id: "4",
      name: "shfgjdfgj",
      format: "ss",
      columnWidth: "31"
		"mandatory":false,
		"unique":false,
		"notEmpty":false,
		"readOnly":false,
		"afterToday":false
    }
  ]
	  "version":17
}

example: http://localhost/PIMF/trunk/server/freeProperties/get.php?data={}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(2,false,$user,$lock);

$returnArray = array();
$returnArray["success"] = TRUE;
$returnArray["records"] = array();

//get all freeProperties
$query = "SELECT * FROM FreeProperties";
$result = mysql_query($query);
if (!$result){
	new error(500,MYSQL_QUERYERROR);
	exit();
}
$returnArray["total"] = mysql_num_rows($result);

while ($row = mysql_fetch_assoc($result)) {
	$tempArray = array();
	$tempArray["id"] = (int) $row["id"];
	$tempArray["name"] = $row["name"];
	$tempArray["format"] = $row["format"];
	$tempArray["columnWidth"] = (int) $row["columnWidth"];
	$tempArray["mandatory"] = (bool) $row["mandatory"];
	$tempArray["unique"] = (bool) $row["unique"];
	$tempArray["notEmpty"] = (bool) $row["notEmpty"];
	$tempArray["readOnly"] = (bool) $row["readOnly"];
	$tempArray["afterToday"] = (bool) $row["afterToday"];
	$returnArray["records"][] = $tempArray;
}

mysql_free_result($result);

//get version number
$version = new version();
$returnArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($returnArray);

?>