<?php

/*
upload images

call has to look like:
login:
{
		"username":"guest",
		"password":"guest"
}

data:
{
	"name":"testimg"
}

+ File uploaded with <form enctype="multipart/form-data" action="__URL__" method="POST"> cf. http://www.php.net/manual/en/features.file-upload.post-method.php

answer looks like:
{
  "success": true,
  "id": 21,
	"version":123

	OR LIKE THIS ON ERROR

	{
  "success": false,
  "errormessage": "TEST MESSAGE"
}
}

example: http://localhost/PIMF/trunk/server/images/create.php?data={"name":"testimg"}&login={"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}

*/

//////////////////////////////////
//for testing
/*
?>
<html>
	<body>
		<form enctype="multipart/form-data" action="create.php" method="post" >
			<label for="file">Image:</label><input type="file" name="file" id="file" />
			<input type="hidden" name="data" id="data" value='{"name":"testimg"}' />
			<input type="hidden" name="login" id="login" value='{"username":"Mihael.Kodric","password":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}' />
			<input type="submit" name="submit" value="Submit" />
		</form>
	</body>
</html>
<?php
*/
/////////////////////////////////

//Initialize
require_once('../php/init.php');

//check privilege
new checkPrivilege(1,true,$user,$lock);

//check if all arraykeys for performing this action exist
$needed = array("name");
$json->checkKeys($needed);

//check for file errors
if($_FILES["file"]["error"] != 0){
  new error(400,IMAGE_ERROR);
}

//check file size
if($_FILES["file"]["size"] > IMAGE_MAX_SIZE){
  new error(400,IMAGE_SIZE);
}

//check the file type
if($_FILES["file"]["type"] != "image/jpeg"){
  new error(400,IMAGE_TYPE);
}

$id = (int) $db->insertOneRow("Images",$call);

//construct the new name of the image
$name = $id;
$name .= ".jpeg";
//check if that image already exists
if(!file_exists("../../data/images/".$name)){
	//create the image
	move_uploaded_file($_FILES["file"]["tmp_name"],"../../data/images/".$name);
	//create the thumbnail
	$thumb = imagecreatetruecolor(80, 80);
	list($width, $height) = getimagesize("../../data/images/".$name);
	$image = imagecreatefromjpeg("../../data/images/".$name);
	$ratioImage = $width/$height;
	$widthThumb = 80;
	$heightThumb = 80;
	$x = 0;
	$y = 0;
	/*
	echo "width vorher: ".$width."<br/>";
	echo "height vorher: ".$height."<br/>";
	echo "ratioImage".$ratioImage."<br/>";
	*/
	//case width >= height
	if($ratioImage >= 1){
		$factor = $widthThumb / $width;
		$y = round(($heightThumb - $factor * $height)/2);
		$heightThumb = $factor * $height;
	} else {
		$factor = $heightThumb / $height;
		$x = round(($widthThumb - $factor * $width)/2);
		$widthThumb = $factor * $width;
	}
	/*
	echo "width thumb: ".$widthThumb."<br/>";
	echo "height thumb: ".$heightThumb."<br/>";
	echo "factor".$factor."<br/>";
	*/
	imagecopyresampled($thumb,$image,$x,$y,0,0,$widthThumb,$heightThumb,$width,$height);
	imagejpeg($thumb,"../../data/images/thumbnails/".$name,100);
	$responseArray = array();
	//increase the version number and return the new version number
	$db->increaseVersion();
	$version = new version();
	$responseArray["id"] = $id;
	$responseArray["version"] = (int) $version->returnVersion();

	//send the response
	$json->sendResponse($responseArray);
} else {
	//delete the image in the db
	$db->deleteOneRow("images","id",$id);
	new error(400,IMAGE_EXISTS);
}

?>
