<div style="width:100%; clear:both; display:inline-block; height:45px; line-height:45px; background-color:#a9bdce; padding: 0px; padding-left: 0px: margin:0px;">
<i class="fas fa-arrow-left" style="font-size: 16px; color:black; margin-right:5px" onclick="loadMemberList();"></i> <span id="spanChatName">슈퍼맨, 스파이더맨</span>
</div>
<div style="width:100%; clear:both; display:inline-block; height:calc(100% - 95px); background-color:#b2c7d9; padding:0px; padding-left:0px; margin:0px; overflow-y:auto" id="MAIN_CONTENTS">
{{#CHAT}}
{{#chatCode}}
{{#isMy}}
<div class="divChaTrMy">

<div style="float:right; width:45%">

<div style="width:100%; padding-top:3px; padding-bottom: 3px; padding-left:8px; padding-right:8px; background-color:#ffeb33; border-radius:7px">{{chat_contents}}</div>

</div>

</div>
{{/isMy}}
{{#isYou}}
<div class="divChatTr">

<div style="float:left">
<img src="/kakaoimg/kakaoicon.png" style="width:33px; height:33px">
</div>
<div style="float:left; margin-left:7px; width:45%">

<div>{{alias}}</div>
<div style="width:100%; padding-top:3px; padding-bottom:3px; padding-left:8px; padding-right:8px; background-color:white; border-radius:7px">{{chat_contents}}</div>
</div>
</div>
{{/isYou}}
{{/chatCode}}
{{/CHAT}}
</div>
<div style="width:100%; clear:both; display:inline-block; height:50px; background-color:white; padding:0px; padding-left:0px; margin:0px">
<div style="width:calc(100% - 50px); height: 100%; padding:0px: margin:0px; float:left">
<textarea style="width:100%; height:100%;border:0px" id="chat_message" name="chat_message"></textarea>
</div>
<div style=" width:50px; height: 100%; background-color:yellow; padding:0px; margin:0px; float:left">

<i class="fas fa-angle-right" style="font-size: 44px; color:#666666; vertical-align:middle; line-height:44px; margin-top:3px; margin-left:16px" onclick="sendChat();"></i>
	</div>
</div>