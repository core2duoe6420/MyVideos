<?php
	include_once("connectdb.php"); 
	header("Content-type: text/plain");

	$table_name = $_GET["table"];
	$sql = "";
	if($table_name == "movie")
		$sql = "SELECT $table_name.id,chinese,english,addtime,resolution.name AS resolution, encodegroup.name AS encodegroup,
			storage.name AS storage FROM $table_name,encodegroup,storage,resolution
			WHERE $table_name.storage=storage.id AND $table_name.resolution=resolution.id AND $table_name.encodegroup=encodegroup.id";
	if($table_name == "collection")
		$sql = "SELECT $table_name.id,chinese,english,count,addtime,resolution.name AS resolution, encodegroup.name AS encodegroup,
			storage.name AS storage FROM $table_name,encodegroup,storage,resolution
			WHERE $table_name.storage=storage.id AND $table_name.resolution=resolution.id AND $table_name.encodegroup=encodegroup.id";
	if($table_name == "tvseries")
		$sql = "SELECT $table_name.id,chinese,english,season,addtime,resolution.name AS resolution, encodegroup.name AS encodegroup,
			storage.name AS storage FROM $table_name,encodegroup,storage,resolution
			WHERE $table_name.storage=storage.id AND $table_name.resolution=resolution.id AND $table_name.encodegroup=encodegroup.id";

	$result = mysql_query($sql);

	$data = array();
  	while($row = mysql_fetch_array($result)) {
		$data[] = $row;
  	}

	echo json_encode($data); 

	mysql_close($con);
?>
