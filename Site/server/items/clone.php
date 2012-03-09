<?php

/*

clone items
note that items with readOnly freeProperty can be cloned

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"
}

data:
{
  "ids": [2,3],
  "count": 3
}

answer looks like:
{
	"ids": [
		[5,6,7], //for id=2
		[8,9,10] //for id=3
	],
	"version":123
}

example: http://localhost/PIMF/trunk/server/items/clone.php?data={"ids":[2,3],"count":"3"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("ids","count");
$json->checkKeys($needed);

if(!is_numeric($call["count"])){
	echo "asd";
	new error(400,JSON_WRONG_CALL_FORMAT);
	exit();
}

//check if the items that should be cloned exists
$cloneIds = array();
foreach($call["ids"] as $id){
	if(!is_numeric($id)){
		new error(400,JSON_WRONG_CALL_FORMAT);
		exit();
	}
	$cloneIds[] = $id;
	
	$test = $db->queryOneRow(array("id"), "Items", "id", $id);

	//check if the item exists
	if($test["id"] == NULL){
		new error(500,OTHER_CLONE_NOT_EXIST);
		exit();
	}
	
}

$responseArray = array();

//perform the cloning
foreach($cloneIds as $cloneId){
	//get all data for that item
	$item = $db->queryOneRow(array("id","name","description","image"), "Items", "id", $cloneId);
	
	//get all folderIds from that item
	$folders = array();
	$folderQuery = sprintf("SELECT * FROM ItemFolderLinks WHERE `itemId` = '%s'", mysql_real_escape_string($cloneId));
	$folderResult = mysql_query($folderQuery);
	if (!$folderResult){
		new error(500,MYSQL_QUERYERROR);
		exit();
	}
	
	if(mysql_num_rows($folderResult)){
		while($row = mysql_fetch_assoc($folderResult)){
			$folders[] = $row["folderId"];
		}
	}
	
	//get all freePropertyValues from that item
	$freePropertyValues = array();
	$freePropertyValueQuery = sprintf("SELECT * FROM FreePropertyValues WHERE `itemId` = '%s'", mysql_real_escape_string($cloneId));
	$freePropertyValueResult = mysql_query($freePropertyValueQuery);
	if (!$freePropertyValueResult){
		new error(500,MYSQL_QUERYERROR);
		exit();
	}
	
	if(mysql_num_rows($freePropertyValueResult)){
		while($row = mysql_fetch_assoc($freePropertyValueResult)){
			$freePropertyValues[] = array("freePropertyId"=>$row["freePropertyId"],"value"=>$row["value"]);
		}
	}
	
	$tmp = array();
	for($i=0;$i<$call["count"];$i++){
	
		$query["id"] = $db->insertOneRow("Items", array("name"=>$item["name"],"description"=>$item["description"],"image"=>$item["image"]));
	
		foreach($folders as $key=>$value){
			$db->insertOneRow("ItemFolderLinks", array("itemId"=>$query["id"],"folderId"=>$value));
		}
	
		foreach($freePropertyValues as $key=>$value){
			$db->insertOneRow("FreePropertyValues", array("itemId"=>$query["id"],"freePropertyId"=>$value["freePropertyId"],"value"=>$value["value"]));
		}
	
		$tmp[] = $query["id"];
	}
	$responseArray['ids'][] = $tmp;
}

//increase the version number and return the new version number
$db->increaseVersion();
$version = new version();
$responseArray["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($responseArray);

?>