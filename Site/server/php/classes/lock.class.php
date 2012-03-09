<?php

/*
class returning the lock number (userid of user who locked the db)
*/

class lock {
	
	private $lock;
		
	//get the lock number
	function __construct() {

		$query = "SELECT * FROM Misc ";
		$result = mysql_query($query);
		if (!$result){
			new error(500,MYSQL_QUERYERROR);
			exit();
		}
		
		if(mysql_num_rows($result)){
			while($row = mysql_fetch_assoc($result)){
				$this->lock = $row["lock"];
			}
		}
		
	}
	
	//return the version number
	function checkLock($userId){
		if($this->lock == $userId){
			return TRUE;
		} else {
			return FALSE;
		}
	}
	
	//return the lock number
	function returnLock(){
		return $this->lock;
	}

}
?>
