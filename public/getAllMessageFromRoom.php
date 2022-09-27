<?php
    include "conn.php";
    $room_id=$_POST["room_id"]
    $SQL = " SELECT A.chatCode, A.roomCode, A.memberCode, B.alias, A.chat_contents,A.read_yn FROM chat A, Member B where A.memberCode=B.memberCode and A.roomCode='".$room_id."' order by A.insertDate ASC";
	$result = mysqli_query($db_link, $SQL);
	$chatResult = dbresultTojson($result);
	echo $chatResult;
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