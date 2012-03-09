<?php
/*
class handling errors by returning appropriate error header with an error message.

e.g.:  header("HTTP/1.0 400 " . rawurlencode('Error! <br/> Call is no correct json string.'));

*/

class error {

	//return the error message
	function __construct($type,$message) {

		if($type == 400){
			//header("HTTP/1.0 400 " . rawurlencode(ERROR_CLASS_400.$message)); //client errors
			$responseArray["success"] = FALSE;
			$responseArray["errormessage"] = $message;
			$version = new version();
			$responseArray["version"] = (int) $version->returnVersion();
			echo json_encode($responseArray);
		} else {
			//header("HTTP/1.0 500 " . rawurlencode(ERROR_CLASS_500.$message)); //server errors
			$responseArray["success"] = FALSE;
			$responseArray["errormessage"] = $message;
			$version = new version();
			$responseArray["version"] = (int) $version->returnVersion();
			echo json_encode($responseArray);
		}

    exit();

	}

}
?>

