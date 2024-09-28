const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./router/router");
const io = require("./socket/socket");

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", router);

dotenv.config();

let port = process.env.serverPort || 5000;

let mainServer = app.listen(port, () => {
  console.log("Server is running on port " + port);
});

io.listen(mainServer);
