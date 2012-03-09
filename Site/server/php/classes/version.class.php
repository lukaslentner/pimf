<?php

/*
class returning the current version number
*/

class version {
	
	private $version;
		
	//get the version number
	function __construct() {

		$query = "SELECT * FROM Misc ";
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		
		if(mysql_num_rows($result)){
			while($row = mysql_fetch_assoc($result)){
				$this->version = $row["version"];
			}
		}
		
	}
	
	//return the version number
	function returnVersion(){
		return $this->version;
	}

}
?>
