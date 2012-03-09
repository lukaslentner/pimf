<?php
/*
Class managing communication with mysql database
*/

class db {

	private $idArray = array(); //array containing all ids from folders that needto be deleted
	private $link;
	private $ancestors = array();
	private $allChilds = array();
	private $cloneFolderReturn = 0;
	private $folderMap = array();
	private $alreayClonedItems = array();

	function __construct() {

		$this->link = mysql_connect(MYSQL_SERVER, MYSQL_USERNAME, MYSQL_PASSWORD);

		if (!$this->link) {
			new error(500,MYSQL_CONNECTIONERROR);
			exit();
		}

		if(function_exists('mysql_set_charset') == FALSE){
			mysql_query('SET NAMES "utf8"', $this->link);
		} else {
			mysql_set_charset('utf8',$this->link);
		}

		$db_select = mysql_select_db(MYSQL_DB, $this->link);

		if (!$db_select) {
			new error(500,MYSQL_SELECTDBERROR);
			exit();
		}

	}

	function __destruct() {
		if($this->link){
			mysql_close();
		}
	}


	//queryonerow - selects the fields given in $fieldsarray in $table where $uniquefield = $uniquevalue and returns an associative array (key is the fieldname)
	function queryOneRow($fieldsarray, $table, $uniquefield, $uniquevalue) {

		// get the required fields out of the array
		if(is_array($fieldsarray)) {
			$fields = implode("`, `",  $fieldsarray);
		} else {
			$fields =  $fieldsarray;
		}

		//perform the query
		$query = sprintf("SELECT `%s` FROM `%s` WHERE `%s` = '%s'", mysql_real_escape_string($fields), mysql_real_escape_string($table), mysql_real_escape_string($uniquefield), mysql_real_escape_string($uniquevalue));
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		$num_rows = mysql_num_rows($result);

		//if query result is empty, returns NULL, otherwise, returns an array containing the selected fields and their values
		if($num_rows == NULL){
			return NULL;
		} else {
			$queryresult = array();
			$num_fields = mysql_num_fields($result);
			$i = 0;
			while ($i < $num_fields){
				$currfield = mysql_fetch_field($result, $i);
				$queryresult[$currfield->name] = mysql_result($result, 0, $currfield->name);
				$i++;
			}
			return $queryresult;
			mysql_free_result($result);
		}

	}

	//insertonerow - inserts $array into $table; $array must be an associative array with fieldname as key
	function insertOneRow($table, $array) {

		$fields = implode("`, `", array_keys($array));

		//values must have single quotes, so the escape has to be done before adding the quotes
		foreach ($array as $key => &$value) {
			$value = mysql_real_escape_string($value);
			$value = "'$value'";
		}

		$values = implode(", ",  array_values($array));

		//perform the query
		$query = sprintf("INSERT INTO `%s` (`%s`) VALUES (%s)", mysql_real_escape_string($table), mysql_real_escape_string($fields), $values);
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}

		return mysql_insert_id();

	}

	function updateOneRow($table,$array,$uniquefield, $uniquevalue){

		//values must have single quotes, so the escape has to be done before adding the quotes
		$what = array();
		foreach ($array as $key => $value) {
			$value = mysql_real_escape_string($value);
			$what[$key] = "`".$key ."` = ". "'$value'";
		}

		$what = implode(", ",  array_values($what));

		//perform the query
		$query = sprintf("UPDATE %s SET %s WHERE %s = '%s'", mysql_real_escape_string($table), $what, mysql_real_escape_string($uniquefield), mysql_real_escape_string($uniquevalue) );

		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}

	}

	//get all folders that are subfolders of the given folder
	function getAllFolders($folderId){

		$this->idArray[] = $folderId;

		$query = sprintf("SELECT id FROM Folders WHERE 	parentFolderId = '%s'", mysql_real_escape_string($folderId));

		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		if(mysql_num_rows($result) != NULL){
			while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
					$this->idArray[] = $row["id"];
					db::getAllFolders($row["id"]);
			}
		}

	}

	function returnAllFolders(){
		$this->idArray = array_unique($this->idArray);
		return $this->idArray;
	}

	function deleteOneRow($table,$uniquefield, $uniquevalue){

		//perform the query
		$query = sprintf("DELETE FROM %s WHERE %s = '%s'", mysql_real_escape_string($table), mysql_real_escape_string($uniquefield), mysql_real_escape_string($uniquevalue));

		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}

	}

	//creates a Tree of ids of all the folders
	function createTree($folderId){

		$result = array();
	    $temp = db::getChildren($folderId);

	    if(!empty($temp)){
		    foreach($temp as $childId){
		        $result[$childId] = db::createTree($childId);
		    }
    	}

	    return $result;

	}

	function getChildren($folderId){
		$query = sprintf("SELECT id FROM Folders WHERE 	parentFolderId = '%s'", mysql_real_escape_string($folderId));
		$tmp = array();
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}

		if(mysql_num_rows($result) != NULL){
			while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
					$tmp[] = $row["id"];

			}
		}
		return $tmp;
	}

	//creates an Array of ids of all the ancestors of a folder
	function getAncestors($folderId){

	    $temp = db::getChildren($folderId);

	    if(!empty($temp)){
		    foreach($temp as $childId){
		        db::getAncestors($childId);
				$this->ancestors[] = $childId;
		    }
    	}
	    return $this->ancestors;
	}

	//increase version number
	function increaseVersion(){
		//UPDATE yourtable SET column=column+1
		$query = "UPDATE Misc SET version = version+1";

		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
	}


	function getAllChildren($folderId){

	    $temp = db::getChildren($folderId);

	    if(!empty($temp)){
		    foreach($temp as $childId){
		    	$this->allChilds[] = $childId;
		        db::getAllChildren($childId);
		    }
    	}

	    return TRUE;

	}

	function returnAllChildren(){
		$tmp = $this->allChilds;
		$this->allChilds = array();
		return $tmp;

	}

	//create the folder tree for cloneFolder
	function createCloneFolderTree($folderId,$parentFolderId){
		//clone folder with folderId = $folderId and name it $newFolderId
		//if $parentFolderId == 0 than function was called the first time and the $newFolderId is put into the parent of $folderId
		if($parentFolderId == 0){
			$newFolderId = db::copyFolder($folderId,0);
			$this->cloneFolderReturn = $newFolderId;
			$this->folderMap[$folderId] = $newFolderId;
		} else {
			$newFolderId = db::copyFolder($folderId,$parentFolderId);
			$this->folderMap[$folderId] = $newFolderId;
		}

		//get all subfolders of folderId
	    $temp = db::getChildren($folderId);

	    //for all of those subfolders repeat the previous steps, note that than the $parentFolderId is $newFolderId
	    if(!empty($temp)){
		    foreach($temp as $childId){
		        db::createCloneFolderTree($childId,$newFolderId);
		    }
    	}
	}

	//clone folder with all content in it (all folders and subfolders and items in there folders)
	//$folderId: the current folder that is copied $parentFolderId: the parentFolderId of $folderId
	function cloneFolder($folderId,$parentFolderId){
		//echo "atm: folderId ".$folderId." parentFolderId ".$parentFolderId."<br/>";
		//0. step create folder tree
		if($parentFolderId == 0){
      $this->folderMap = array();
      $this->alreayClonedItems = array();
			db::createCloneFolderTree($folderId,$parentFolderId);
		}
		//after folder tree is created clone the items

		//clone all items in folderId = $folderId an put them in $this->folderMap[$folderId]
		//1. step: get all itemIds
		$itemIds = array();
		$query = sprintf("SELECT `itemId` FROM `ItemFolderLinks` WHERE `FolderId` = '%s'", mysql_real_escape_string($folderId));
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		if(mysql_num_rows($result)){
			while($row = mysql_fetch_assoc($result)){
				$itemIds[] = $row["itemId"];
			}
		}

		//2. step: foreach of these items call function copyItem in order to copy item (Items,ItemFolderLinks,FreePropertyValues,ItemFolderLinks)
		foreach($itemIds as $itemId){
			db::copyItem($itemId,$this->folderMap[$folderId]);
		}

		//get all subfolders of folderId
	    $temp = db::getChildren($folderId);

	    //for all of those subfolders repeat the previous steps, note that than the $parentFolderId is $this->folderMap[$folderId]
	    if(!empty($temp)){
		    foreach($temp as $childId){
		        db::cloneFolder($childId,$this->folderMap[$folderId]);
		    }
    	}

		$return = $this->cloneFolderReturn;
		return $return;
	}

	//make copy $folderId in $parentFolderId (if $parentFolderId == 0 than copy it to parent of $folderId) and return new id
	function copyFolder($folderId,$parentFolderId){
		$query = sprintf("SELECT `name`,`description`,`parentFolderId`,`type`,`manualURL`,`homepageURL`,`image` FROM `Folders` WHERE `id` = '%s'", mysql_real_escape_string($folderId));
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		$tmp = array();
		while($row = mysql_fetch_assoc($result)){
			$tmp = $row;
		}
		if($parentFolderId != 0){
			$tmp["parentFolderId"] = $parentFolderId;
		}
		return db::insertOneRow("Folders",$tmp);
	}

	//copy item with its freePropertyvalues and put it into $newFolderId
	function copyItem($itemId,$newFolderId){
		//check if item already has been copyed
		if(!array_key_exists($itemId,$this->alreayClonedItems)){
			//1.step copy the item in table Items and remember that item in $alreayClonedItems
			$query = sprintf("SELECT `name`,`description`,`image` FROM `Items` WHERE `id` = '%s'", mysql_real_escape_string($itemId));
			$result = mysql_query($query);
			if (!$result){
				new error(500,MYSQL_QUERYERROR);
				exit();
			}
			$tmp = array();
			while($row = mysql_fetch_assoc($result)){
				$tmp = $row;
			}
			$newItemId = db::insertOneRow("Items",$tmp);
			$this->alreayClonedItems[$itemId] = $newItemId;
			//2.step copy the freePropertyValues for the new item
			$query = sprintf("SELECT `freePropertyId`,`value` FROM `FreePropertyValues` WHERE `itemId` = '%s'", mysql_real_escape_string($itemId));
			$result = mysql_query($query);
			if (!$result){
				new error(500,MYSQL_QUERYERROR);
				exit();
			}
			$tmp = array();
			while($row = mysql_fetch_assoc($result)){
				$tmp = $row;
				$tmp["itemId"] = $newItemId;
				db::insertOneRow("FreePropertyValues",$tmp);
			}
			//3.step copy the itemFolderLinks of the item (take care that the folderIds in $this->folderMap[$folderId] have changed)
			$query = sprintf("SELECT `itemId`,`folderId` FROM `ItemFolderLinks` WHERE `itemId` = '%s'", mysql_real_escape_string($itemId));
			$result = mysql_query($query);
			if (!$result){
				new error(500,MYSQL_QUERYERROR);
				exit();
			}
			$tmp = array();
			while($row = mysql_fetch_assoc($result)){
				$tmp = $row;
				$tmp["itemId"] = $newItemId;
				//check if the folderId is in $this->folderMap i.e. it has changed
				if(array_key_exists($tmp["folderId"],$this->folderMap)){
					$tmp["folderId"] = $this->folderMap[$tmp["folderId"]];
				}

				db::insertOneRow("ItemFolderLinks",$tmp);
			}
    	}
	}

}


?>
