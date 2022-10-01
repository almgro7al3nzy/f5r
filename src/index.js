const app = require("express")();
const cors = require("cors");
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("dotenv/config");
const general = io.of("/general");
const football = io.of("/football");
const basketball0 = io.of("/1");
const basketball21 = io.of("/2");
const basketball32 = io.of("/3");
const basketball564 = io.of("/4");
const basketball56 = io.of("/5");
const basketballsa = io.of("/6");
const basketballdf = io.of("/7");
const basketballgfh = io.of("/8");
const baskhjetball = io.of("/9");
const basketxcbball = io.of("/10");
const baskfgdetball = io.of("/11");
const baskedvbtball = io.of("/12");
const basketvbball = io.of("/13");
const baskevtball = io.of("/14");
const baskebtball = io.of("/15");
const basketxcbvball = io.of("/16");
const basketbxcbvall = io.of("/17");
const rooxcvbcmfdg = io.of("/18");
const basketbxcvball = io.of("/19");
const basketxcvbball = io.of("/20");
const basketxcvbball = io.of("/21");
var people = {};

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
