		<div style="width:20%; display:inline-block; height:100%; background-color:#ececed; padding:0px; padding-top:10px; margin:0px; text-align:center; float:left">
			<div>
				<i class="fas fa-user class_icon" id='icon_member' style="font-size: 28px; color:black" onclick="$('.class_icon').css('color', '#909297'); $(this).css('color', 'black'); if(MEMBER_ROOM_MODE != 'MEMBER') {loadMemberList();}"></i>
			</div>
			<div style="margin-top:16px">
				<i class="fas fa-comment class_icon" id='icon_room' style="font-size: 28px; color:#909297" onclick="$('.class_icon').css('color', '#909297'); $(this).css('color', 'black'); if(MEMBER_ROOM_MODE != 'ROOM'){loadRoomList();}"></i>
			</div>
		</div>
		<div style="width:76%; display:inline-block; height:100%; background-color:#ffffff; padding:0px; margin:0px; padding-top:10px; float:left" id="divChatOrMember">
		</div>