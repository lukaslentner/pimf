<?php

/*
delete free Properties

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

example: http://localhost/PIMF/trunk/server/freeProperties/delete.php?data={"ids":["15","16"]}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(2,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids");
$json->checkKeys($needed);

foreach($call["ids"] as $key=>$value){
	if(!is_numeric($value)){
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}
	//check if there is a freePropertyValue with this id
	if($db->queryOneRow("itemId", "FreePropertyValues", "freePropertyId", $value) == NULL){
		$db->deleteOneRow("FreeProperties","id", $value);
	} else {
		new error(400,OTHER_FREEPROPERTYVALUE_EXISTS);
		exit();
	}
}

//increase the version number and return the new version number
$responseArray = array();
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>