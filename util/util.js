const pg = require("pg");
const multer = require("multer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const fs = require("fs");

// code to connect to the database
const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    ca: process.env.crt,
  },
});

db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

db.on("connect", () => {
  console.log("Connected to database");
});

const authenticate = (req, res, next) => {
  const { JWT_SECRET } = process.env;
  const token = req.headers.authorization || req.body.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error verifying token" });
  }
};

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const avatarUpload = multer({ storage: avatarStorage });

module.exports = { db, avatarUpload, authenticate };
