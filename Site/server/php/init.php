<?php
//file initializing everything thats needed in every file

//Errorhandling
function handleError($errno, $errstr,$error_file,$error_line){
	header("HTTP/1.0 500 " . rawurlencode($errstr));
  if(DEBUG == true){
    echo '{"msg":"'.$errstr.' on line '.$error_line.' in file '.$error_file.'"}';
  } else {
    echo "{}";
  }
	exit();

}

set_error_handler("handleError");

//Include vars.php (Global Variables)
require_once('vars.php');

//Autoload the classes
function __autoload($class_name){
	//class directories  (currently theres only one directory)
	$directories = array('../php/classes/');
	foreach($directories as $directory){
	    //see if the file exsists
	    if(file_exists($directory.$class_name . '.class.php')){
	        require_once($directory.$class_name . '.class.php');
	        return;
	    }
	}
}

//parse the json data
if(DEBUG == true){	
print_R($_GET);
	$json =  new json($_GET['data'], $_GET['login']); //for testing
} else {
	$json =  new json($_POST['data'], $_POST['login']); //for usage	
}
//authenticate the user
$db = new db();
$user = new user($json->getAuthData(),$db);
$lock = new lock();

$call = $json->getAllData();

?>
