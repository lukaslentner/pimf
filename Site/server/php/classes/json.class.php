<?php
/*
class handling json communication

example call:
{
	 "login": {	
		"username":"guest",
		"password":"guest"
	},
	"name":"name",
	"parentFolderId":"parentFolderId",
	"description":"description",
	"type":"type",
	"typeData":"typeData(JSON-Objekt was so in die DB soll"
}

example: http://localhost/PIMF/trunk/server/folders/create.php?data={"login": {"username":"Mihael.Kodric","password":"11feb83139c2b9c5b0d7b99c011ce5d6"},"name":"Fach2","parentFolderId":"7","description":"","type":"location","typeData":"{}"}

*/

class json {
	
	private $data;	
	private $login;
	
	//Decode data
	function __construct($dataString, $loginString) {
		
		if(isset($dataString) OR isset($loginString)){
			if($dataString != "{}"){
				if(json_decode($dataString, true) != NULL){
					$this->data = json_decode($dataString, true);
				} else {
					new error(400,JSON_INCORRECT_STRING);
					exit();		
				}	
			} else {
				$this->data = array();
			}
			
			if($loginString != "{}"){
				if(json_decode($loginString, true) != NULL){
					$this->login = json_decode($loginString, true);
				} else {
					new error(400,JSON_INCORRECT_STRING);
					exit();		
				}
			} else {
				$this->login = array();
			}

			if(!is_array ($this->data)){
				new error(400,JSON_NO_ARRAY);
				exit();
			}
			
			if(!is_array ($this->login)){
	      		new error(400,JSON_NO_LOGIN);
	      		exit();
	    	}
			
		} else {
			new error(400,JSON_NO_CALL);
			exit();
		}
		
	}
				
	//Return all data
	function getAllData(){
		return $this->data;	
	}
		
	//Return login data
	function getAuthData(){
		return $this->login;
	}
		
	//Response
	function sendResponse($responseData){	
		
		if($responseData == NULL){
			$responseData = array();
			$responseData["success"] = TRUE;
			echo json_encode($responseData);
		} else {
			$responseData["success"] = TRUE;
			echo json_encode($responseData);
		}
		
	}
	
	//check if the call has all necessary arraykeys
	function checkKeys($array){
		foreach($array as $key=>$value){
			if(!array_key_exists($value,$this->data)){
				new error(400,JSON_WRONG_CALL_FORMAT);
				exit();
			}
		}
		return true;
	}
}
?>