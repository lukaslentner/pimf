<?php

/*
check password and return role

call has to look like:
login:
{
	"username":"Mihael.Kodric",
	"password":"0fa060ce8cbef67e00b7c811dfbb722b8750028d"
}

data:
{

}

answer looks like:
{
	"username":"Mihael.Kodric",
	"password":"0fa060ce8cbef67e00b7c811dfbb722b8750028d",
	"role":2
}

example: http://localhost/PIMF/trunk/server/users/getRole.php?data={}&login={"username":"Mihael.Kodric","password":"0fa060ce8cbef67e00b7c811dfbb722b8750028d"}

*/

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(0,false,$user,$lock);

//$loginData = $json->getAuthData();
$loginData['role'] = (int) $user->returnPrivilege();

//get version
$version = new version();
$loginData["version"] = (int) $version->returnVersion();

//send the response
$json->sendResponse($loginData);

?>
