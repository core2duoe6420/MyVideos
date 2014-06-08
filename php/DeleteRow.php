<?php
	include_once("connectdb.php"); 
	header("Content-type: text/plain");
	
	$sql = "DELETE FROM $_GET[table] WHERE id=$_GET[id]";

	if (!mysql_query($sql, $con)) {
  		die('Error: ' . mysql_error());
  	}
	echo "success";

	mysql_close($con);
?>
