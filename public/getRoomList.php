<?php
	include "conn.php";

	$SQL = " SELECT roomCode, members, members_name FROM room where replace(concat('|',members,'|'),',','|,|') like '%|".$_SESSION["kakao_member_code"]."|%' ";
	$result = mysqli_query($db_link, $SQL);
	$roomResult = dbresultTojson($result);
	echo $roomResult;

	function dbresultTojson($res)
	{
		$ret_arr = array();

		while($row = mysqli_fetch_array($res))
		{
			foreach($row as $key => $value){
				$row_array[$key] = urlencode($value);
			}
			array_push($ret_arr, $row_array);
		}

		return urldecode(json_encode($ret_arr));
	}
?>