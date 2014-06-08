<?php
	include_once("connectdb.php"); 
	header("Content-type: text/plain");

	$table_name = $_POST["table"];
	$sql = "";

	if($table_name == "movie")
		$sql = "INSERT INTO $table_name(chinese, english, addtime, resolution, encodegroup, storage) VALUES
			('$_POST[chinese]','$_POST[english]',default,$_POST[resolution],$_POST[encodegroup], $_POST[storage])";
	else if($table_name == "tvseries")
		$sql = "INSERT INTO $table_name(chinese, english, season, addtime, resolution, encodegroup, storage) VALUES
			('$_POST[chinese]','$_POST[english]','$_POST[season]',default,$_POST[resolution],$_POST[encodegroup], $_POST[storage])";
	else if($table_name == "collection")
		$sql = "INSERT INTO $table_name(chinese, english, count, addtime, resolution, encodegroup, storage) VALUES
			('$_POST[chinese]','$_POST[english]',$_POST[count],default,$_POST[resolution],$_POST[encodegroup], $_POST[storage])";


	if (!mysql_query($sql, $con)) {
  		die('Error: ' . mysql_error());
  	}
	echo "success";

	mysql_close($con);
?>
