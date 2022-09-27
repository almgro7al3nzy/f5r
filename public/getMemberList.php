<?php
    include "conn.php";
    $SQL = " SELECT memberCode, userId, userIcon, alias FROM member order by alias ";
	$result = mysqli_query($db_link, $SQL);
	$memberResult = dbresultTojson($result);
	echo $memberResult;
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