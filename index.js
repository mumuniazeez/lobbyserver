const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./router/router");
const { Server } = require("socket.io");
const { sendMessage, getMessages } = require("./controllers/message");

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", router);

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

dotenv.config();

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);
  socket.on("joinRoom", async (messageInfo) => {
    socket.join(messageInfo.roomId);
    console.log("User joined a room:", messageInfo.username);
    let msg = await getMessages(messageInfo);
    socket.emit("prevMessages", msg);
  });
  socket.on("leaveRoom", async (messageInfo) => {
    socket.leave(messageInfo.roomId);
    console.log("User left a room:", messageInfo.username);
  });

  socket.on("sendMessage", async (messageInfo) => {
    let msg = await sendMessage(messageInfo);
    io.to(messageInfo.roomId).emit("sendMessage", msg);
  });
});

io.on("disconnection", (socket) => {
  console.log("User disconnected");
});
