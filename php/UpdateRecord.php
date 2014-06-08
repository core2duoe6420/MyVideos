<?php
	include_once("connectdb.php"); 
	header("Content-type: text/plain");

	$sql = "UPDATE $_POST[table] SET name='$_POST[name]' WHERE id=$_POST[id]";

	if (!mysql_query($sql, $con)) {
  		die('Error: ' . mysql_error());
  	}
	echo "success";

	mysql_close($con);
?>
