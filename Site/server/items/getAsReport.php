<?php

/*
create reports

call has to look like:

login:
{
		"username":"",
		"password":""
}

data:
	{
		//logic may be "AND" or "OR"
		"logic":"AND";

		defined in items/pattern.txt e.g.
		"pattern":
			[
				{"subject": "is", "comparator": "is", "value": "1"},...
			]
		recursiveTree: true, <-if true content of all folders an subfolders etc. is shown
		recursiveReports: true <- if true create additional resport for each folder
		summarize: true <- if true summarize identical entries (folders are summarized if they have the same content)
	}

answer looks like:
HTML page....

example: http://localhost/PIMF/trunk/server/items/getAsReport.php?data={"summarize":true,"recursiveTree":true,"recursiveReports":true,"logic":"AND","pattern":[{"subject":"id","comparator":"is","value":"15"},{"subject": "type", "comparator": "is", "value": "folder"},{"subject": "type", "comparator": "is", "value": "location"}]}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}
or: http://localhost/PIMF/trunk/server/items/getAsReport.php?data={"summarize":true,%22recursiveTree%22:true,%22recursiveReports%22:false,%22logic%22:%22OR%22,%22pattern%22:[{%22subject%22:%22any%22,%22comparator%22:%22has%22,%22value%22:%2222%22}]}&login={%22username%22:%22Mihael.Kodric%22,%22password%22:%22da39a3ee5e6b4b0d3255bfef95601890afd80709%22}
or:
http://localhost/PIMF/trunk/server/items/getAsReport.php?data={%22summarize%22:true,%22recursiveTree%22:true,%22recursiveReports%22:true,%22logic%22:%22AND%22,%22pattern%22:[{%22subject%22:%22id%22,%22comparator%22:%22is%22,%22value%22:%22168%22},{%22subject%22:%20%22type%22,%20%22comparator%22:%20%22is%22,%20%22value%22:%20%22folder%22},{%22subject%22:%20%22type%22,%20%22comparator%22:%20%22is%22,%20%22value%22:%20%22location%22}]}&login={%22username%22:%22Mihael.Kodric%22,%22password%22:%22da39a3ee5e6b4b0d3255bfef95601890afd80709%22}
*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(0,false,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("pattern","logic","recursiveTree","recursiveReports","summarize");
$json->checkKeys($needed);

//STEP 1 call /items/get.php with the pattern in oder to get all items and folders which have to be in the report

//construct the data for /items/get.php
$data = $call;
unset($data["recursiveTree"]);
unset($data["recursiveReports"]);
$data['report'] = true; //needed for easier format (see /items/get.php)
$data = json_encode($data);

//construct the login for /items/get.php
$login = json_encode($json->getAuthData());

//construct the url to /items/get.php
$url = 'http://'.$_SERVER['SERVER_ADDR'].$_SERVER['PHP_SELF'];
$url = substr($url, 0, -15);
$url .= 'get.php';

//call /items/get.php
$answer = file_get_contents($url.'?'.http_build_query(array('data' => $data, 'login' => $login),NULL,'&'), false);

//construct an array from the answer
$answer = json_decode($answer, true);

//STEP 2 construct the report

//first construct the whole report (if recursiveReports is true the other reports are created later. So there is alsways a comlete report)

$report = new report($db);

//#############
//TODO Anpassen des Berichts
echo $report->createReport($answer,"PIMF Bericht (kompletter Bericht)",json_encode($call),$user->returnUserName(),$call["recursiveTree"],$call["summarize"]);
$report->endReport();
//#############

//create the recursive reports
if($call["recursiveReports"] == true){
	if(is_array($answer["folders"])){
		//step 1. determine all folders for which to create a report
		$folders = array();
		foreach($answer["folders"] as $folderId){
			$db->getAllChildren($folderId);
			$folders[] = $folderId;
			$folders = array_merge((array)$folders, (array)$db->returnAllChildren());
		}
		$folder = array_unique($folders);
		//step 2. foreach of those folders create a report
		foreach($folders as $id){
			//step 2.5 get all folders and items which are in that folder
			$tmpRecursiveReports = array();
			$tmpRecursiveReports["folders"] = $db->getChildren($id);
			$tmpRecursiveReports["items"] = array();
			$query = "SELECT itemId FROM ItemFolderLinks WHERE folderId = ".$id;
			$result = mysql_query($query);
			if (!$result){
				new error(500,MYSQL_QUERYERROR);
				exit();
			}
			if(mysql_num_rows($result)){
				while($row = mysql_fetch_assoc($result)){
					$tmpRecursiveReports["items"][] = $row["itemId"];
				}
			}
			$tmp = $db->queryOneRow(array("parentFolderId","name","type"),"Folders","id",$id);
			$name = $tmp["name"];
			$type = $tmp["type"];
			$parentId = $tmp["parentFolderId"];
			//print_R($id);
			$tmpParent = $db->queryOneRow(array("name"),"Folders","id",$parentId);
//#############
//TODO Anpassen des Berichts			
			echo $report->createReport($tmpRecursiveReports,"Bericht zu ".$tmpParent["name"]."/".$name." (Typ: ".$type.") (ID: ".$id.")",NULL,$user->returnUserName(),$call["recursiveTree"],$call["summarize"]);
//#############			
			$report->endReport();
		}
	}
}

echo $report->footer();

?>
