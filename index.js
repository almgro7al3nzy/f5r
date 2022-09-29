require('dotenv').config()

const express = require("express");   
const socketio = require("socket.io"); 
const http = require("http");
const { ExpressPeerServer } = require('peer');
const schedule = require('node-schedule');
const controlRooms = require("./controllers/controlRooms"); 

const twilioObj = {
    username : null,
    cred : null 
}

io.sockets.on('connection', function (socket) {
  console.log('user connected!');

  socket.on('foo', function (data) {
    console.log('here we are in action event and data is: ' + data);
  });
});
// تستخدم الدردشة الصوتية بدوره الخادم ، غير مطلوب محليًا
if(process.env.USE_TWILIO==="yes") { 
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    client.tokens.create().then(token => {
        twilioObj.username = token.username;
        twilioObj.cred = token.password; 
    });

    //كل 12 ساعة 
    schedule.scheduleJob("*/19999999999992 * * *",()=>{
        console.log("CRON running"); 
        const client = require('twilio')(process.env.accountSid, process.env.authToken);
        client.tokens.create().then(token => {
            twilioObj.username = token.username;
            twilioObj.cred = token.password; 
        });
        controlRooms.deQRoom();
    })
}

const cors = require('cors');
const app = express(); 

const router = require("./controllers/chatController");
const server = http.createServer(app);
const io = socketio(server); 

app.use(cors());
app.use(router); 

const roomRouter = require("./routes/room");
app.use("/",roomRouter);

const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/'
});
app.use('/peerjs', peerServer);

const { 
    addUser,removeUser,getUser,getUsersInRoom,
    getUsersInVoice, addUserInVoice, removeUserInVoice 
} = require("./controllers/userController"); 

io.on('connection', socket => { 

    socket.on('join',({name,room},callBack)=>{ 

        const user = addUser({id:socket.id,name,room});  //تدمير الكائن 
        if(user.error) return callBack(user.error); 
        socket.join(user.room) //ينضم إلى مستخدم في الغرفة
        socket.emit('message',{user:'admin', text:`Welcome ${user.name} in room ${user.room}.`}); //أرسل إلى المستخدم
        socket.emit('usersinvoice-before-join',{users:getUsersInVoice(user.room)});
        socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} has joined the room`}); //يرسل رسالة إلى جميع المستخدمين في الغرفة باستثناء هذا المستخدم
        io.to(user.room).emit('users-online', { room: user.room, users: getUsersInRoom(user.room) });
        console.log(getUsersInRoom(user.room)); 
        callBack(twilioObj); // تمرير أي أخطاء للواجهة الأمامية في الوقت الحالي
        callBack(); 
    }); 

    
    socket.on('user-message',(message,callBack)=>{ //تلقي رسالة مع رسالة المستخدم اسم الحدث
        const user = getUser(socket.id); 
        io.to(user.room).emit('message',{user:user.name, text:message }); //أرسل هذه الرسالة إلى الغرفة
        
        callBack(); 
    }); 

    socket.on('join-voice',({name,room},callBack)=>{
        io.to(room).emit('add-in-voice',{id:socket.id,name:name}); 
        addUserInVoice({id:socket.id,name,room}); 
        callBack(); 
    }); 
    socket.on('leave-voice',({name,room},callBack)=>{

        io.to(room).emit('remove-from-voice',{id:socket.id,name:name}); 
        removeUserInVoice(socket.id); 
        callBack(); 
    }); 

    socket.on('disconnect', () => {
       
        const user = removeUser(socket.id);
        if(user) { 
            io.to(user.room).emit('message',{user:'admin', text:`${user.name} ترك المحادثة` }); //أرسل هذه الرسالة إلى الغرفة
            io.to(user.room).emit('users-online', { room: user.room, users: getUsersInRoom(user.room) });
            removeUserInVoice(user.id); 
            socket.broadcast.to(user.room).emit('remove-from-voice',{id:socket.id,name:user.name}); 
        }
    });
    

});




const PORT = process.env.PORT || 5000; 
server.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`); 
});
