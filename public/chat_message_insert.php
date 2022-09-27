<?php
    include "conn.php";
    $room_id=$_POST["roomId"];
    $chat_message=$_POST["chat_message"];
    if($room_id && $chat_message && $_SESSION["kakao_member_code"]){
        $SQL = "insert into chat(roomCode,memberCode,chat_contents,read_yn) values('".$room_id."','".$_SESSION["kakao_member_code"]."','".$chat_message."','N') ";
        $result = mysqli_query($db_link, $SQL);
        echo "OK";
    }
?>