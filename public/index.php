<?php
    include "conn.php";
    if(isset($_SESSION["kakao_member_code"])==false || !$_SESSION['kakao_member_code']){
    ?>
        <script>
            location.replace("login.php");
        </script>
    <?php
      exit;
    }

?>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8" />
	<title>카카오톡</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0" />
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet">
	<style>
		.divFriendTr {
			height:33px;
			display:inline-block;
			line-height:33px;
			vertical-align:middle;
			padding-top:6px;
			padding-bottom:6px;
			padding-left:14px;
			margin:0px;
			width:calc(100% - 14px);
			clear:both;
		}

		.divChatTr {
			min-height:33px;
			display:inline-block;
/*			line-height:33px;*/
			vertical-align:middle;
			padding-top:6px;
			padding-bottom:6px;
			padding-left:10px;
			margin:0px;
			width:calc(100% - 10px);
			float:left;
			clear:both;
			font-size:13px
		}

		.divChatTrMy {
			min-height:33px;
			display:inline-block;
/*			line-height:33px;*/
			vertical-align:middle;
			padding-top:6px;
			padding-bottom:6px;
			padding-right:30px;
			margin:0px;
			width:calc(100% - 30px);
			float:right;
			clear:both;
			font-size:13px
		}
	</style>
	<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
	<!-- Mustache CDN -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.1/mustache.min.js"></script>
	<script src="/jquery.bpopup.min.js"></script>

	<script>
	    let websocket=null;
		let NOW_ROOM_ID="";
		let MEMBER_ROOM_MODE="";
	    $(document).ready(function(){
	        connect();
	        MEMBER_ROOM_MODE = "MEMBER";
			loadChatMemberList();
	    });
		function loadChatMemberList() {
			$("#MAIN").css("left", (0 - $(document).width()));
			$("#MAIN").load("chat_member_container.php", function(){
				$("#MAIN").animate({left:0, top:0});
				if(MEMBER_ROOM_MODE == "ROOM") {
					loadRoomList();
				}
				else {
					loadMemberList();
				}
			});
		}
		function loadRoomList() {
			//1. 데이터베이스의 회원 정보를 읽어 json 객체 형태로 받는 것
			$.ajax({
			  type: 'POST',
			  url: "getRoomList.php",
			  data: {},
			  dataType : 'text',
			  cache: false,
			  async: false
			})
			.done(function( result ) {
			  $("#divChatOrMember").load("room.php", function(){
			    MEMBER_ROOM_MODE = "ROOM";
				let roomList = {"ROOM": JSON.parse(result)};

				//2. 받은 내용을 무스타크로 출력하는 것
				var output = Mustache.render($("#divRoomList").html(), roomList);
				$("#divRoomList").html(output);

				$('.class_icon').css('color', '#909297');
				$("#icon_room").css('color', 'black');
			  });
			})
			.fail(function( result, status, error ) {
					//실패했을때
					alert("에러 발생:" + error);
			});
		}
	    function connect(){
	        websocket=new WebSocket('ws://');
	        websocket.onopen=function(e){
	            let data={
					"code":"member_login",
					"memberCode":"<?php echo $_SESSION["kakao_member_code"]?>",
					"memberAlias":"<?php echo $_SESSION["kakao_member_alias"]?>"
				};
	            sendMessage(data);
	        }
			websocket.onmessage=function(e){
				let message = JSON.parse(e.data);
				switch(message.code){
					case "send_roominfo":
						NOW_ROOM_ID=message.room_id;
						getAllMessageFromRoom(NOW_ROOM_ID,"first");
						break;
					case "arrive_new_message":
						NOW_ROOM_ID=message.room_id;
						getAllMessageFromRoom(NOW_ROOM_ID,"notfirst");
						break;
					case "room_member_inserted":
						let chat_name = getChatName(message.members);
						$("#spanChatName").html(chat_name);
						break;
				}
			}
	    }
		function getAllMessageFromRoom(room_id,mode){
			$.ajax({
                        type: 'POST',
                        url: "getAllMessageFromRoom.php",
                        data: {"room_id":room_id},
                        dataType : 'text',
                        cache: false,
                        async: false
                    }).done(function( result ) {
						console.log(result);
							let chatList={"CHAT":JSON.parse(result)};
							chatList.CHAT.forEach(function(element,index){
								let isMy=false;
								let isYou=true;
								if(element.memberCode=="<?php echo $_SESSION["kakao_member_code"]?>"){
									isMy=true;
									isYou=false;
								}
								element.chat_contents=chatList.CHAT[index].chat_contents.replace(/(?:\r\n|\r|\n)/g,'<br/>');
								chatList.CHAT[index].isMy=isMy;
								chatList.CHAT[index].isYou=isYou;
							});
							if(mode=="first"){
								var output=Mustache.render($("#MAIN").html(), chatList);
								$("#MAIN").html(output);
								$("#MAIN_CONTENTS").scrollTop($("#MAIN_CONTENTS")[0].scrollHeight);
							}
							else{
								$("#BACKGROUND").load("chat.php",function(){
									let chat_name = $("#spanChatName").html();
									var output=Mustache.render($("#BACKGROUND").html(),chatList);
									$("#MAIN").html(output);
									$("#spanChatName").html(chat_name);
									$("#BACKGROUND").html("");
									$("#MAIN_CONTENTS").scrollTop($("#MAIN_CONTENTS")[0].scrollHeight);
								})
							}

                        })
                        .fail(function( result, status, error ) {
                            //실패했을때
                            alert("에러 발생:" + error);
                        });
		}
	    function sendMessage(msg){
	        websocket.send(JSON.stringify(msg));
	    }
	    function loadMemberList(){
			$.ajax({
			  type: 'POST',
			  url: "getMemberList.php",
			  data: {},
			  dataType : 'text',
			  cache: false,
			  async: false
			})
			.done(function( result ) {
			  //성공했을때
			  $("#divChatOrMember").load("member.php", function(){
			    MEMBER_ROOM_MODE = "MEMBER";
				let memberList = {"MEMBER": JSON.parse(result)};

				//2. 받은 내용을 무스타크로 출력하는 것
				var output = Mustache.render($("#divMemberList").html(), memberList);
				$("#divMemberList").html(output);

				$('.class_icon').css('color', '#909297');
				$("#icon_member").css('color', 'black');
			  });
			})
			.fail(function( result, status, error ) {
					//실패했을때
					alert("에러 발생:" + error);
			});
		}
		function openChat(new_member_code,new_member_alias){
			let members=[];
			let me = {
				"memberCode":"<?php echo $_SESSION["kakao_member_code"]?>",
				"memberAlias":"<?php echo $_SESSION["kakao_member_alias"]?>"
			}
			members.push(me);
			let you={
				"memberCode":new_member_code,
				"memberAlias":new_member_alias
			}
			if("<?php echo $_SESSION["kakao_member_code"]?>"!=new_member_code){
				members.push(you);
			}
			$("#MAIN").css("left",($(document).width()+100));
		    $("#MAIN").load("chat.php",function(){
		        $("#MAIN").animate({left:0,top:0});
				let chat_name=getChatName(members);
				$("#spanChatName").html(chat_name);
				let data={"code":"create_room","members":members};
				sendMessage(data);
		    });
		}
		function addMember() {
			if(NOW_ROOM_ID) {
				$.ajax({
				  type: 'POST',
				  url: "getMemberList.php",
				  data: {"except_room_id": NOW_ROOM_ID},
				  dataType : 'text',
				  cache: false,
				  async: false
				})
				.done(function( result ) {
				  //성공했을때
					let memberList = {"MEMBER": JSON.parse(result)};

					//2. 받은 내용을 무스타크로 출력하는 것
					var output = Mustache.render($("#divAddMemberTemplate").html(), memberList);
					$("#divAddMember").html(output);
				})
				.fail(function( result, status, error ) {
						//실패했을때
						alert("에러 발생:" + error);
				});
				$("#divAddMember").bPopup();
			}
		}
		function addMemberComplete() {
			let members = [];

			$(".clAddMember").each(function(index, item){
				if($(item).is(':checked') == true) {
					let tmpMember = {"memberCode": $(item).val(),"memberAlias": $(item).attr("alias")}
					members.push(tmpMember);
				}
			});
			let data = {
				"code":"room_member_insert",
				"room_id": NOW_ROOM_ID,
				"members": members
			};
			sendMessage(data);

			$("#divAddMember").bPopup().close();
		}

		function openRoom(members_code, members_name) {
			let members = [];
			let arr_members_code = members_code.split(",");
			let arr_members_name = members_name.split(",");

			for(let i=0; i < arr_members_code.length; i++) {
				let tmp_member = {
					"memberCode": arr_members_code[i],
					"memberAlias": arr_members_name[i]
				};
				members.push(tmp_member);
			}

			$("#MAIN").css("left", ($(document).width() + 100));
			$("#MAIN").load("chat.php", function(){
				$("#MAIN").animate({left:0, top:0});

				let chat_name = getChatName(members);
				$("#spanChatName").html(chat_name);

				let data = {
					"code":"create_room",
					"members": members
				};
				sendMessage(data);
			});
		}
		function getChatName(members){
			let return_value="";
			members.forEach(function(element,index){
				if(!return_value){
					return_value=element.memberAlias;
				}else{
					return_value+=","+element.memberAlias;
				}
			});
			return return_value;
		}
		function sendChat(){
			let chat_message=$("#chat_message").val();
			$.ajax({
                        type: 'POST',
                        url: "chat_message_insert.php",
                        data: {"roomId":NOW_ROOM_ID,"chat_message":chat_message},
                        dataType : 'text',
                        cache: false,
                        async: false
                    })
                        .done(function( result ) {
                            //성공했을때
							console.log(result);
                            if(result=="OK"){
								let data={
									"code":"send_chat",
									"room_id":NOW_ROOM_ID,
									"send_memberCode":"<?php echo $_SESSION["kakao_member_code"]?>"
								};
								sendMessage(data);
							}
                        })
                        .fail(function( result, status, error ) {
                            //실패했을때
                            alert("에러 발생:" + error);
                        });
		}
	</script>
</head>
<body style="margin:0px">
	<div style="width:100%; display:inline-block; height:630px; padding:0px; margin:0px; position:relative; left:0px; top:0px" id="MAIN">
	</div>
    <div style="width:0%; height:0px; padding:0px; margin:0px; position:relative; left:0px; top:0px" id="BACKGROUND">
	</div>

	<div id="divAddMember" style="display:none; background-color:white; border:2px solid black; width:250px; padding:15px">
	</div>

	<div id="divAddMemberTemplate" style="display:none">
		{{#MEMBER}}
			{{#alias}}
				<div class="divFriendTr">
					<div style="float:left">
						<img src="{{userIcon}}" style="width:33px; height:33px">
					</div>
					<div style="float:left; margin-left:7px">
						{{alias}}
					</div>
					<div style="float:right; margin-right:15px">
						<input type=checkbox name="chAddMember" class="clAddMember" value="{{memberCode}}" alias="{{alias}}">
					</div>
				</div>
			{{/alias}}
		{{/MEMBER}}
		<div style="text-align:center; margin-top:20px">
			<button style="background-color:yellow; border:0px; padding:10px; padding-top:5px; padding-bottom:5px; border:1px solid #eeeeee; border-radius:3px; font-weight:bold" onclick="addMemberComplete();">추가하기</button>
		</div>
	</div>
</body>
</html>