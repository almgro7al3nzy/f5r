const WebSocket = require("ws");
const mysql = require("mysql");
const ws = new WebSocket.Server({port:8008});
let ALL_USER=[];
let ALL_ROOM=[];
ws.on("connection",function connect(websocket,req){
   websocket.on("message",function incoming(message){
      console.log(JSON.parse(message));
      message=JSON.parse(message);
      switch (message.code){
         case "member_login":
            login(message.memberCode,message.memberAlias);
            break;
         case "create_room":
            message.members.sort(function (a,b){
               return a.memberCode-b.memberCode;
            });
            ROOM_ID=createRoom(message.members);
            break;
         case "send_chat":
            sendChat(message.room_id,message.send_memberCode);
            break;
         case "room_member_insert":  //방에 회원 추가
            roomMemberInsert(message.room_id, message.members);
            break;
      }
   });
   function roomMemberInsert(room_id, members) {
      let ROOM_ID = "";
      //DATABASE에 room 정보를 insert
      const conn = mysql.createConnection({
         host: "localhost",
         user: "root",
         password: "",
         database: "kakaotalk"
      });

      let sql = " select members, members_name from room where roomCode='" +room_id+ "' ";
      conn.query(sql, function(err, rows, fields){
         if(rows && rows.length > 0) { //동일한 회원들이 참여하는 방이 이미 존재하는 경우
            let this_members = rows[0].members;
            let this_members_name = rows[0].members_name;

            let this_members_arr = this_members.split(",");
            let this_members_name_arr = this_members_name.split(",");

            for(let q=0; q < this_members_arr.length; q++) {
               let memberCode = this_members_arr[q];
               let memberAlias = this_members_name_arr[q];

               let tmpMember = {"memberCode": memberCode,"memberAlias": memberAlias}
               members.push(tmpMember);
            }

            members.sort(function(a,b){  //memberCode 기준으로 오름차순 정렬 (1,2,3,4...10)
               return a.memberCode - b.memberCode;
            });

            let all_member = "";
            let all_member_name = "";
            members.forEach(function(element, index){
               if(!all_member) {
                  all_member = element.memberCode
                  all_member_name = element.memberAlias
               }
               else {
                  all_member += "," + element.memberCode
                  all_member_name += "," + element.memberAlias
                  //3,2,1,4
               }
            });

            sql = " update room set members='"+all_member+"', members_name='"+all_member_name+"' where roomCode='"+room_id+"' ";
            conn.query(sql, function(err){console.log(err);});

            ALL_ROOM.forEach(function(element, index) {
               if(element.id == room_id) {  //맞는 방 찾기
                  element.members = members;
               }
            });

            let data = {"code": "room_member_inserted", "room_id": room_id, "members": members};
            sendMessage(data);
         }
      });
   }
   function login(memberCode,memberAlias){
      let member_data={
         "memberCode":memberCode,
         "memberAlias":memberAlias,
         "ws":websocket
      };
      ALL_USER.push(member_data);
      console.log("Login OK");
   }
   function createRoom(members){
      let ROOM_ID="";
      const conn=mysql.createConnection({
         host:"localhost",
         user:"",
         password:"",
         database:""
      });
      let all_member="";
      members.forEach(function (element,index){
         if(!all_member){
            all_member=element.memberCode
         }else{
            all_member+=","+element.memberCode
         }
      });
      let sql="select roomCode from room where members='"+all_member+"'";
      conn.query(sql,function (err,rows,fields){
         if(rows && rows.length>0){
            ROOM_ID=rows[0].roomCode;
         }else{
            sql="INSERT INTO room(members) values('"+all_member+"')";
            conn.query(sql,function(){});
            sql="select max(roomCode) as roomCode from room";
            conn.query(sql,function(err,rows,fields){
               ROOM_ID=rows[0].roomCode;
            });
         }
         conn.end();
         createRoomStep2(ROOM_ID,members);
         return ROOM_ID;
      });

   }
   function createRoomStep2(t_ROOM_ID,t_members){
      let room_data={
         "id":t_ROOM_ID,
         "members":t_members
      }
      let findSameRoomid = ALL_ROOM.filter(function (element){
         return element.id == t_ROOM_ID;
      });
      if(findSameRoomid.length==0){
         ALL_ROOM.push(room_data);
      }
      console.log("createRoom OK");
      sendRoomInfo(t_ROOM_ID);
   }
   function sendRoomInfo(t_ROOM_ID){
      let data={"code":"send_roominfo","room_id":t_ROOM_ID};
      sendMessage(data);
      console.log("sendRoomInfo OK");
   }
   function sendMessage(msg){
      websocket.send(JSON.stringify(msg));
   }
   function sendChat(room_id,memberCode){
      ALL_ROOM.forEach(function (element,index){
         if(element.id==room_id){
            element.members.forEach(function(member,memberindex){
               ALL_USER.forEach(function (user,userindex){
                  if(member.memberCode==user.memberCode){
                     let data={"code":"arrive_new_message","room_id":"room_id"};
                     user.ws.send(JSON.stringify(data));
                     console.log("arrive_new_message_OK");
                  }
               })
            })
         }
      })
   }
});