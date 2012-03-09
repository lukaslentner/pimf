<?php

/*
class determining the rule violations
*/

class violation {
	
	function __construct() {

	}
	
	//return rule violations for one item
	function oneItemViolation($itemId,$db){
		$responseArray = array();
		//get all freePropertyIds for that item
		$query = sprintf("SELECT * FROM `FreePropertyValues` WHERE `itemId` = '%s'",mysql_real_escape_string($itemId));
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		$freeProperyValues = array();
		$freeProperties = array();
		if(mysql_num_rows($result)){
			while($row = mysql_fetch_assoc($result)){
				$freeProperyValues[$row["freePropertyId"]] = $row;
				//get all  freePropery flags for these freePropertyIds
				$tmp = $db->queryOneRow(array("mandatory","unique","notEmpty","readOnly","afterToday"),"FreeProperties","id",$row["freePropertyId"]);
				$freeProperties[$row["freePropertyId"]] = $tmp;
			}	
		}
		//check where ever a flag is set is that rule if violated (mandatory is done later)
		foreach($freeProperties as $key=>$value){
			if($value["afterToday"] == 1){
				//check if the date given in freeProperyValues is in the past
				if(strtotime(date('Y-m-d')) >= strtotime($freeProperyValues["$key"]["value"])){
					$responseArray[$key][] = "afterToday";
				}
			}
			if($value["notEmpty"] == 1){
				//check if the freeProperyValue is not empty
				if($freeProperyValues[$key]["value"] == ""){
					$responseArray[$key][] = "notEmpty";
				}
			}
			if($value["unique"] == 1){
				//check if any of all of the values from that freePropertyId are not unique
				$query = sprintf("SELECT `value` FROM `FreePropertyValues` WHERE `freePropertyId` = '%s'",mysql_real_escape_string($key));
				$result = mysql_query($query);
				if (!$result){
					new error(500,MYSQL_QUERYERROR);
					exit();
				}
				$tmp = array();
				if(mysql_num_rows($result)){				
					while($row = mysql_fetch_assoc($result)){
						$tmp[] = $row["value"];
					}
					//check for multiple entries
					if(count($tmp) != count(array_unique($tmp))){
						$responseArray[$key][] = "unique";
					}
				}
			}
		}
		//check mandatory by getting ALL freeProperties (not just from this item) where the mandatory flag is set 
		//and checking if there is a entry in freeProperyValues with that freePropertyId and itemId
		$query = "SELECT `id` FROM `FreeProperties` WHERE `mandatory` = 1";
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		$tmp = array();
		if(mysql_num_rows($result)){
			while($row = mysql_fetch_assoc($result)){
				$tmp[] = $row["id"];
			}
		}
		foreach($tmp as $key=>$value){
			//echo "value ist gerade:".$value."<br/>";
			$query = sprintf("SELECT `value` FROM `FreePropertyValues` WHERE `itemId` = '%s' AND `freePropertyId` = '%s'",mysql_real_escape_string($itemId),mysql_real_escape_string($value));
			$result = mysql_query($query);
			if (!$result){
				new error(500,MYSQL_QUERYERROR);
				exit();
			}
			//if there are no affected rows the mandatory rule is violated
			if(!mysql_num_rows($result)){
				$responseArray[$value][] = "mandatory";
			}
		}
		return $responseArray;
	}
	
	//return all items that have rule violations (only return the itemIds)
	function violatingItems(){
		$responseArray = array();
		//start by getting everything out of the database (this is done to improve performance, note that use of oneItemViolation() in a loop would produce more querys)
		//get all item Ids
		$query = "SELECT `id` FROM `Items`";
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		$items = array();
		if(mysql_num_rows($result)){
			while($row = mysql_fetch_assoc($result)){
				$items[] = $row["id"];
			}	
		}
		//get all freePropertyValues
		$query = "SELECT * FROM `FreePropertyValues`";
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		$freePropertyValues = array();
		if(mysql_num_rows($result)){
			while($row = mysql_fetch_assoc($result)){
				$freePropertyValues[] = $row;
			}	
		}			
		//get all freeProperties
		$query = "SELECT * FROM `FreeProperties`";
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		$freeProperties = array();
		if(mysql_num_rows($result)){
			while($row = mysql_fetch_assoc($result)){
				$freeProperties[$row["id"]] = $row;
			}	
		}
		//loop through each item an check for violations
		foreach($items as $item){
			$itemId = $item;
			//determine all freeProperties of this item AND construct a freeProperyValues array with only the freeProperties of current item (key is the freeProperty Id)
			$tmpfreeProperties = array(); //freeProperties of current item
			$tmpfreeProperyValues = array(); //array of freeProperyValues for current item
			//print_R($freePropertyValues);
			foreach($freePropertyValues as $key=>$value){
				if($value["itemId"] == $itemId){
					$tmpfreeProperties[$value["freePropertyId"]] = $freeProperties[$value["freePropertyId"]];
					$tmpfreeProperyValues[$value["freePropertyId"]] = $value;
				}
			}
			unset($value);
			unset($key);
//DEBUG			
/*
			echo "<br/>";
			echo $itemId;
			echo "<br/> tmpfreeProperties: ";
			print_R($tmpfreeProperties);
			echo "<br/> tmpfreeProperyValues: ";
			print_R($tmpfreeProperyValues);
			echo "<br/>";
*/
			//check where ever a flag is set if that rule is violated (mandatory is done later)		
			foreach($tmpfreeProperties as $key=>$value){
				if($value["afterToday"] == 1){
					//check if the date given in freeProperyValues is in the past
					if(strtotime(date('Y-m-d')) >= strtotime($tmpfreeProperyValues["$key"]["value"])){
						$responseArray[] = $itemId;
					}
				}
				if($value["notEmpty"] == 1){
					//check if the freeProperyValue is not empty
					if($tmpfreeProperyValues[$key]["value"] == ""){
						$responseArray[] = $itemId;
					}
				}
				if($value["unique"] == 1){
					//check if any of all of the values from that freePropertyId are not unique
					//get all "values" of FreePropertyValues for that freePropertyId regardless of itemId
					$tmpUniqueCheck = array();
					foreach($freePropertyValues as $k=>$v){
						if($v["freePropertyId"] == $key){
							//echo "HIERRRR item ".$item." FP(v) ".$v["freePropertyId"]." FPvalue ".$key."<br/>";
							$tmpUniqueCheck[] = $v["value"];
						}
					}
		
					//check for multiple entries
					if(count($tmpUniqueCheck) != count(array_unique($tmpUniqueCheck))){
						//get freePropertyvalues that are not unique
						foreach(array_count_values($tmpUniqueCheck) as $test=>$number){
							if($number != 1){
								$query = sprintf("SELECT `itemId` FROM `FreePropertyValues` WHERE `value` = '%s'",mysql_real_escape_string($test));
								$result = mysql_query($query);
								if (!$result){
									new error(500,MYSQL_QUERYERROR);
									exit();
								}
								//if there are no affected rows the mandatory rule is violated
								if(mysql_num_rows($result)){
									while($row = mysql_fetch_assoc($result)){
										$responseArray[] = $row["itemId"];
									}	
								}
							}
						}
					}
					
					
					
				}
			}
			unset($value);
			unset($key);
			
			//check mandatory by getting ALL freeProperties where the mandatory flag is set 
			//and checking if there is a entry in freeProperyValues with that freePropertyId and itemId
			
			//determine all freeProperties there mandatory flag is set
			$tmpMandatoryCheck = array();
			foreach($freeProperties as $key=>$value){
				if($value["mandatory"] == 1){
					$tmpMandatoryCheck[] = $value["id"];
				}
			}
			unset($value);
			unset($key);
			foreach($tmpMandatoryCheck as $key=>$value){
				if(!isset($tmpfreeProperyValues[$value]["value"])){
					$responseArray[] = $itemId;
				}
			}
			
		}
		$responseArray = array_unique($responseArray);
		
		return $responseArray;
	}

	
}
?>
