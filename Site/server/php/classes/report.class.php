<?php

/*
class creating a report
*/

class report {
	
	private $html = "";
	private $url = "";
	private $db;
	private $result = array(); //array containing all folders and items for each report;
		
	//construct the header of the html page
	function __construct($db) {
		
		$this->db = $db;
		$this->url = 'http://'.$_SERVER['SERVER_ADDR'].$_SERVER['PHP_SELF'];
		$this->url = substr($this->url, 0, -28);
		$css = $this->url."data/report/print.css";

		$this->html .= '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'."\n";
		$this->html .= '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="de">'."\n";
		$this->html .= "\n";
		$this->html .= '<head>'."\n";
		$this->html .= '	<title>Praktikum Inventar: Bericht</title>'."\n";
		$this->html .= '	<link rel="stylesheet" type="text/css" href="'.$css.'" />'."\n";
		$this->html .= '</head>'."\n";
		$this->html .= "\n";
		$this->html .= '<body>'."\n";

	}
	
	//create footer of the html page
	function footer(){
		$tmpFooter = '';
		$tmpFooter .= "\n";
		$tmpFooter .= '</body>'."\n";
		$tmpFooter .= "\n";
		$tmpFooter .= '</html>'."\n";
		return $tmpFooter;
	}
	
	//create report
	function createReport($inputArray,$name,$data,$author,$recursiveTree,$summarize){
		
		//step 1. get all folders in inputArray (if recursiveTree is true return also recursivly everything in the folders)
		if(isset($inputArray["folders"])){
			$this->result[] = report::getFolderReport($inputArray["folders"],$recursiveTree);
		}
		//step 2. get all items in the inputArray
		if(isset($inputArray["items"])){
			$this->result[] = report::getItemReport($inputArray["items"]);
		}
		//step 3. summarize identical entries (folders are summarized if they have the same content) (note the itemcount increases by one for the same itemname(the freeeproperties may be different))
		$sumArray = array();
		if($summarize == TRUE){
			$sumArray = report::summarize();	
		} else {
			$sumArray = $this->result;
		}

		//step 4. construct the html page
//#############
//TODO aus $sumArray und $name,$data,$author,$recursiveTree den report bauen
		
		$this->html .= print_R($sumArray);
		return $this->html;
//#############	
	}

	//unset $this->html
	function endReport(){
		unset($this->html);
		unset($this->result);
		return true;
	}
	
	//get all folders in $folders (if recursive is true get also recursivly everything in the folders)
	function getFolderReport($folders,$recursive){
		$returnArray = array();
		$name = "";
		$type = "";
		foreach($folders as $id){
			$tmp = $this->db->queryOneRow(array("name","type"),"Folders","id",$id);
			$name = $tmp["name"];
			$type = $tmp["type"];
			$tmpContent = array();
			if($recursive == true){
				//check if folder has anything in it and display that
				$children = $this->db->getChildren($id);
				$items = array();
				$query = "SELECT itemId FROM ItemFolderLinks WHERE folderId = ".$id;
				$result = mysql_query($query);
				if (!$result){
					new error(500,MYSQL_QUERYERROR);
					exit();
				}
				if(mysql_num_rows($result)){
					while($row = mysql_fetch_assoc($result)){
						$items[] = $row["itemId"];
					}
				}
				if(!empty($children)){
					//step 1. display folders
					$tmpContent[] = report::getFolderReport($children,true);
				}	
				if(!empty($items)){
					//step 2. display items
					$tmpContent[] = report::getItemReport($items);
				}	
			}
			$returnArray[] = array("id" => $id, "type" => $type, "name" => $name, "count" => 1, "content" => $tmpContent);
		}
		return $returnArray;
	}
	
	//get all items in the inputArray
	function getItemReport($items){
		$returnArray = array();
		$name = "";
		foreach($items as $id){
			$tmp = $this->db->queryOneRow(array("name"),"Items","id",$id);
			$name = $tmp["name"];
			$returnArray[] = array("id" => $id, "type" => "item", "name" => $name, "count" => 1);
		}
		return $returnArray;
	}
	
	//summarize identical entries (folders are summarized if they have the same content (note the itemcount has to be the same for one itemname, but the freeproperties can be different))
	function summarize(){	
		$tmp = array();
		//1. summarize all items in one folder which have the same name
		$tmp = report::summarizeItems($this->result);		
		//2. summarize all folders which have the same content
		$tmp = report::summarizeFolders($tmp);	
		return $tmp;
	}

	//summarize all items in one folder which have the same name
	function summarizeItems($input){
		foreach($input as $objKey=>&$obj){
			//check if input contains items
			if(isset($obj["type"])){
				if($obj["type"] == "item"){
					$tmpCount = 1;
					//echo "<br><br>checking item with name ".$obj["name"]." and id: ".$obj["id"]."<br>";
					//echo "this is the input<br>";
					//print_r($input);
					foreach($input as $checkKey=>&$check){
						//check only items
						if(isset($check["type"])){
							if($check["type"] == "item" AND $check["name"] == $obj["name"] AND $check["id"] != $obj["id"]){
								$tmpCount++;
								//echo "FOUND duplicate with name: ".$check["name"]." and id: ".$check["id"]."<br> count is: ".$tmpCount;
								//print_R($obj);
								//unset the duplicate
								unset($input[$checkKey]);
							}	
						}
						//echo "<br><br>";
					}
					//update the count on the item
				 	$input[$objKey]["count"] = $tmpCount;
				 	//echo "<br/>Setting count of itemID ".$input[$objKey]["id"]." to ".$tmpCount;
				} else {
					$input[$objKey]["content"] = report::summarizeItems($obj["content"]);
				}
			} else {
				$input[$objKey] = report::summarizeItems($obj);
			}
		}
		return $input;
	}	

	//summarize all folders which have the same content (note the itemcount has to be the same for one itemname, but the freeproperties can be different)
	function summarizeFolders($input){
		//case 1: $input is an array containing arrays
		if(!isset($input["content"])){
			foreach($input as $objKey=>&$obj){
				if(count($obj) != 1){
					//foreach of the folders construct a check-string with all the item names in it
					$tmpCheck = array();
					foreach($obj as $checkKey=>&$checkValue){
						if(isset($checkValue["content"])){
							$tmpCheck[$checkKey] = report::summarizeFoldersString($checkValue["content"]);
						}
					}	
					if(!empty($tmpCheck)){
						//check for folders with same content via the check-strings
						foreach($tmpCheck as $tmpCheckKey=>&$tmpCheckValue){
							foreach($tmpCheck as $checkKey=>&$checkValue){
								if($tmpCheckValue == $checkValue AND $checkKey != $tmpCheckKey){
									unset($tmpCheck[$checkKey]);
									unset($tmpCheck[$tmpCheckKey]);	
									unset($input[$objKey][$tmpCheckKey]);	
									$input[$objKey][$checkKey]["count"] = $input[$objKey][$checkKey]["count"] + 1;		

								}
							}
						}
					}
				} else {
					$input[$objKey] = report::summarizeFolders($obj[0]);
				}
			}
		//case 2: $input is an array containing one folder	
		} else {
			$input["content"] = report::summarizeFolders($input["content"]);
		}
		return $input;
	}

	// construct a check-string with all the item names in it (note that the count of items in includes in the sting)
	function summarizeFoldersString($obj){	
		$string = "";
		$tmp = array();
		//case 1: $obj is an array containing one folder
		if(isset($obj["content"])){
			foreach($obj["content"] as $key=>&$value){
				if(!isset($value["type"])){
					foreach($value as $checkKey=>&$checkValue){
						if($checkValue["type"] == "item"){
							//get all itemnames and item-counts in this folder
							$tmp[$checkValue["name"]] = $checkValue["count"];
						} else {
							//for each subfolder construct an own string
							$tmp[$checkValue["name"]] = report::summarizeFoldersString($checkValue["content"]);
						}
					}
				} 	
			}
			//sort the array
			ksort($tmp);
			//construct a string with the names like this Count1Name1Count2Name2 e.g. 2Glass1Key3Door for 2*Glass,1*Key,3*Door 
			foreach($tmp as $name=>&$count){
				$string .= $count.$name;
			}
		//case 2: $obj is an array containing arrays
		} else {
			foreach($obj as $key=>&$value){
				foreach($value as $testKey=>&$testValue){
					/*if(isset($testValue["content"])){
						report::summarizeFoldersString($testValue["content"]);
					} else {
						echo "tu zeug<br>";
					}*/
					if($testValue["type"] == "item"){
						//get all itemnames and item-counts in this folder
						$tmp[$testValue["name"]] = $testValue["count"];
					} else {
						//for each subfolder construct an own string
						$tmp[$testValue["name"]] = report::summarizeFoldersString($testValue["content"]);
					}
				}
			}	
			//sort the array
			ksort($tmp);
			//construct a string with the names like this Count1Name1Count2Name2 e.g. 2Glass1Key3Door for 2*Glass,1*Key,3*Door 
			foreach($tmp as $name=>&$count){
				$string .= $count.$name;
			}
		}
		return $string;
	}
}
?>
