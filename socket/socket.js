const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} = require("../controllers/message");
const { Server } = require("socket.io");

let io = new Server({
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
    io.to(messageInfo.roomId).emit("prevMessages", msg);
  });

  socket.on("leaveRoom", async (messageInfo) => {
    socket.leave(messageInfo.roomId);
    console.log("User left a room:", messageInfo.username);
  });

  socket.on("sendMessage", async (messageInfo) => {
    let msg = await sendMessage(messageInfo);
    io.to(messageInfo.roomId).emit("sendMessage", msg);
  });

  socket.on("editMessage", async (messageInfo) => {
    let msg = await editMessage(messageInfo);
    io.to(messageInfo.roomId).emit("prevMessages", msg);
  });

  socket.on("deleteMessage", async (messageInfo) => {
    let msg = await deleteMessage(messageInfo);
    io.to(messageInfo.roomId).emit("prevMessages", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

module.exports = io;
