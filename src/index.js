const app = require("express")();
const cors = require("cors");
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("dotenv/config");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
import React from "react";
import ReactDOM from "react-dom"; 

import App from "./App";

ReactDOM.render(<App/>,document.querySelector("#root"));

server.listen(process.env.PORT || 3000);
