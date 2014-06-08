<?php
	include_once("connectdb.php"); 
	header("Content-type: text/plain");

	$table_name = $_POST["table"];
	$sql = "";

	if($table_name == "movie")
		$sql = "UPDATE $table_name SET chinese='$_POST[chinese]', english='$_POST[english]',resolution=$_POST[resolution],
			encodegroup=$_POST[encodegroup],storage=$_POST[storage] WHERE id=$_POST[id]";
	else if($table_name == "tvseries")
		$sql = "UPDATE $table_name SET chinese='$_POST[chinese]', english='$_POST[english]',season='$_POST[season]', resolution=$_POST[resolution],
			encodegroup=$_POST[encodegroup],storage=$_POST[storage] WHERE id=$_POST[id]";
	else if($table_name == "collection")
		$sql = "UPDATE $table_name SET chinese='$_POST[chinese]', english='$_POST[english]',count=$_POST[count], resolution=$_POST[resolution],
			encodegroup=$_POST[encodegroup],storage=$_POST[storage] WHERE id=$_POST[id]";


	if (!mysql_query($sql, $con)) {
  		die('Error: ' . mysql_error());
  	}
	echo "success";

	mysql_close($con);
?>
