<?php

/*
delete an image an its thumbnail
note that you can only delete an image if it is not used

call has to look like:
login:
{
	"username":"guest",
	"password":"guest"	
}

data:
{
	"id":"id"
}
answer looks like:
{
	"version":123	
}

example: http://localhost/PIMF/trunk/server/images/delete.php?data={"id":"2"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("id");
$json->checkKeys($needed);

if(!is_numeric($call["id"])){
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

//check if the image is used with items
$query = sprintf("SELECT id FROM Items WHERE `image` = '%s'",mysql_real_escape_string($call["id"]));
$result = mysql_query($query);
if (!$result){
	new error(500,MYSQL_QUERYERROR);
	exit();
}
//check if the image is used with folders
$queryFolder = sprintf("SELECT id FROM Folders WHERE `image` = '%s'",mysql_real_escape_string($call["id"]));
$resultFolder = mysql_query($queryFolder);
if (!$resultFolder){
	new error(500,MYSQL_QUERYERROR);
	exit();
}
if(!mysql_num_rows($result) AND !mysql_num_rows($resultFolder)){
 	//check if the files exist
	if(file_exists("../../data/images/".$call["id"].".jpeg") AND file_exists("../../data/images/thumbnails/".$call["id"].".jpeg")){
		//delete the files
		unlink("../../data/images/".$call["id"].".jpeg");
		unlink("../../data/images/thumbnails/".$call["id"].".jpeg");
		//remove the image from the database
		$db->deleteOneRow("Images","id",$call["id"]);
		
		//increase the version number and return the new version number
		$responseArray = array();
		$db->increaseVersion();
		$version = new version();
		$responseArray["version"] = (int) $version->returnVersion();

		//send the response
		$json->sendResponse($responseArray);
	} else {
		new error(400,IMAGE_DELETE_EXISTS);
		exit();
	}
} else {
	new error(400,IMAGE_LINKED);
	exit();
}


?>
