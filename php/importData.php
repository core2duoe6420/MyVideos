<?php

	function getDictionary($table) {
		$result = mysql_query("SELECT * FROM $table");
		$data = array();
	  	while($row = mysql_fetch_array($result))
			$data[$row["name"]] = $row["id"];
	  	return $data;
	}

	include_once("connectdb.php"); 

	$storageDic = getDictionary("storage");
	$resolutionDic = getDictionary("resolution");
	$encodegroupDic = getDictionary("encodegroup");

    	$handle = fopen('movie.csv', 'r');
    	while (($line = fgets($handle)) !== false) {
		$line = rtrim($line);
		$line = str_replace("'", "\\'", $line);
		$data = explode(",", $line);
		$chinese = $data[0];
		$english = $data[1];
		$resolution = $resolutionDic[$data[2]];
		$encodegroup = $encodegroupDic[$data[3]];
		$storage = $storageDic[$data[4]];

		$sql = "INSERT INTO movie(chinese, english, addtime, resolution, encodegroup, storage) VALUES
			('$chinese','$english',default,$resolution,$encodegroup,$storage)";

		if (!mysql_query($sql, $con))
  			die('Error: ' . mysql_error());
    	}
    	fclose($handle);

	$handle = fopen('collection.csv', 'r');
    	while (($line = fgets($handle)) !== false) {
		$line = rtrim($line);
		$line = str_replace("'", "\\'", $line);
		$data = explode(",", $line);
		$chinese = $data[0];
		$english = $data[1];
		$count = $data[2];
		$resolution = $resolutionDic[$data[3]];
		$encodegroup = $encodegroupDic[$data[4]];
		$storage = $storageDic[$data[5]];

		$sql = "INSERT INTO collection(chinese, english, count, addtime, resolution, encodegroup, storage) VALUES
			('$chinese','$english',$count, default,$resolution,$encodegroup,$storage)";

		if (!mysql_query($sql, $con))
  			die('Error: ' . mysql_error());
    	}
    	fclose($handle);

	$handle = fopen('tvseries.csv', 'r');
    	while (($line = fgets($handle)) !== false) {
		$line = rtrim($line);
		$line = str_replace("'", "\\'", $line);
		$data = explode(",", $line);
		$chinese = $data[0];
		$english = $data[1];
		$season = $data[2];
		$resolution = $resolutionDic[$data[3]];
		$encodegroup = $encodegroupDic[$data[4]];
		$storage = $storageDic[$data[5]];

		$sql = "INSERT INTO tvseries(chinese, english, season, addtime, resolution, encodegroup, storage) VALUES
			('$chinese','$english','$season', default,$resolution,$encodegroup,$storage)";

		if (!mysql_query($sql, $con))
  			die('Error: ' . mysql_error());
    	}
    	fclose($handle);
	mysql_close($con);
?>
