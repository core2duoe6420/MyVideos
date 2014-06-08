<?php
	include_once("connectdb.php"); 
	header("Content-type: text/plain");

	$result = mysql_query("SELECT * FROM $_GET[table]");

	$data = array();
  	while($row = mysql_fetch_array($result)) {
		$data[] = $row;
  	}

	echo json_encode($data); 

	mysql_close($con);
?>
