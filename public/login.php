<?php
    include "conn.php";
    $ddlMemberList=$_POST["ddlMemberList"];
    if($ddlMemberList){
    $SQL="select alias from member where memberCode='".$ddlMemberList."'";
    $result=mysqli_query($db_link,$SQL);
    $row=mysqli_fetch_array($result);
    $alias=$row["alias"];
    }
    $_SESSION["kakao_member_code"]=$ddlMemberList;
    $_SESSION["kakao_member_alias"]=$alias;

?>
<script>
    location.replace("index.php");
</script>