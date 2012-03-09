<?php
/*
class authenticating the user

login for guest user:
 "login": {
	"username":"",
	"password":""
}

Privileges:
0 = Guest
1 = Editor
2 = Admin
*/

class user {

	private $privilege = 0;
	private $userId;
	private $username;

	//authenticate the user
	function __construct($array,$db) {

		if(array_key_exists("username",$array) AND array_key_exists("password",$array)){

			if($array["username"] == "" AND $array["password"] == ""){
				new error(400,USER_NOT_EXIST);
				exit();
			} else {
				$this->username = $array["username"];
				$query = $db->queryOneRow(array("id","password","role"), "Users", "username", $array["username"]);
				if($query == NULL){
					new error(400,USER_NOT_EXIST);
					exit();
				}
				if($query["password"] == $array["password"]){
					$this->privilege = $query["role"];
					$this->userId = $query["id"];
					
				} else {
					new error(400,USER_AUTH_WRONG);
					exit();
				}

			}

		} else {
			new error(400,USER_WRONG_FORMAT);
			exit();
		}

	}

	function returnPrivilege(){
		return $this->privilege;
	}
	
	function returnId(){
		return $this->userId;
	}
	
	function returnUserName(){
		return $this->username;
	}

}
?>
