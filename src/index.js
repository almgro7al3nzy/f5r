const app = require("express")();
const cors = require("cors");
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("dotenv/config");
const general = io.of("/general");
const football = io.of("/football");
const basketball = io.of("/1");
const basketball = io.of("/2");
const basketball = io.of("/3");
const basketball = io.of("/4");
const basketball = io.of("/5");
const basketball = io.of("/6");
const basketball = io.of("/7");
const basketball = io.of("/8");
const basketball = io.of("/9");
const basketball = io.of("/10");
const basketball = io.of("/11");
const basketball = io.of("/12");
const basketball = io.of("/13");
const basketball = io.of("/14");
const basketball = io.of("/15");
const basketball = io.of("/16");
const basketball = io.of("/17");
const roomid = io.of("/18");
const basketball = io.of("/19");
const basketball = io.of("/20");
const basketball = io.of("/21");
var people = {};

var generalTotalUser = 0;
var footballTotalUser = 0;
var basketballTotalUser = 0;
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/templates/index.html");
});

io.on("connection", (client) => {

  client.on("join-room", ({ roomId, name}) => {
    if (roomId) {
      client.join(roomId);
      io.to(roomId).emit("new-user", {
        message: `new user ${name} connected!`,
      });
    }
  });

  client.on("send-message", ({ roomId, name, message}) => {
    if (roomId) {
      io.to(roomId).emit("new-message", {
        message,
        name,
      });
    }
  });

  client.on("disconnecting", function () {
    let rooms = Object.keys(client.rooms);
    rooms.forEach( room => client.to(room).emit("connection left", ` ${client.id} + " has left`));
  });
  
});

server.listen(process.env.PORT || 3000);
