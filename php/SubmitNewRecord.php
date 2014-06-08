<?php
	include_once("connectdb.php"); 
	header("Content-type: text/plain");

	$sql = "INSERT INTO $_POST[table](name,note) VALUES
		('$_POST[name]','$_POST[note]')";

	if (!mysql_query($sql, $con)) {
  		die('Error: ' . mysql_error());
  	}
	echo "success";

	mysql_close($con);
?>
