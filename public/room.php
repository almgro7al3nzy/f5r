
		<div style="width:100%; height:30px; padding:0px; margin:0px; color:black; padding-left:14px">
			채팅
		</div>
		<div style="width:100%; height:calc(100% - 30px); padding:0px; margin:0px; margin-bottom:-30px; color:black; overflow-y:auto" id="divRoomList">
					{{#ROOM}}
						{{#members_name}}
							<div class="divFriendTr">
								<div style="float:left">
									<img src="/kakaoimg/kakaoicon.png" style="width:33px; height:33px">
								</div>
								<div style="float:left; margin-left:7px" onclick="openRoom('{{members}}','{{members_name}}');">
									{{members_name}}
								</div>
							</div>
						{{/members_name}}
					{{/ROOM}}
		</div>
