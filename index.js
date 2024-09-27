const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./router/router");

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", router);

dotenv.config();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
