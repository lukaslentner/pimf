<?php

/*
return all folders and their subfolders

call has to look like:
data:
{}

login:
{
	"username":"",
	"password":""
}



answer looks like:

{
	"success":true,
	"total":27,
	"records":[
		{"id":1,"name":"Kategorien","parentFolderId":0,"description":"","type":"category","manualURL":"","homepageURL":"", image:0},
		{"id":2,"name":"Versuche","parentFolderId":0,"description":"","type":"experiment","manualURL":"","homepageURL":"", image:0},
		{"id":3,"name":"Orte","parentFolderId":0,"description":"","type":"location","manualURL":"","homepageURL":"", image:0},
		...
		],
	"version":13
}


example: http://localhost/PIMF/trunk/server/folders/get.php?data={}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(0,false,$user,$lock);

$responseArray = array();
$responseArray['success'] = TRUE;
$responseArray['total'] = 0;
$responseArray['records'] = array();

//get all folders
$query = "SELECT * FROM Folders";

$result = mysql_query($query);
if (!$result){
	new error(500,MYSQL_QUERYERROR);
	exit();
}

while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	$responseArray['records'][] = array('id' => (int) $row["id"],
                                        'name' => $row["name"],
                                        'parentFolderId' => (int) $row["parentFolderId"],
                                        'description' => $row["description"],
                                        'type' => $row["type"],
                                        'image' => (int) $row["image"],
                                        'manualURL' => $row["manualURL"],
                                        'homepageURL' => $row["homepageURL"]);
	$responseArray['total']++;
}

//get version number
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>