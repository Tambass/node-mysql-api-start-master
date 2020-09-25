const express = require("express"),
  app = express(),
  mysql = require("mysql"),
  util = require("util"),
  path = require("path"),
  port = 3000;

// .env
require("dotenv").config();

// MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connecté au serveur MySQL");
});

const query = util.promisify(db.query).bind(db);
global.querysql = query;

// Middleware - Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public
app.use(express.static(path.join(__dirname, "public")));

const authRoute = require("./routes/auth.route");
const usersRoute = require("./routes/users.route");

// Router
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);

// 404
app.get("*", function (req, res, next) {
  res.status(404);
  res.json({ message: "Page introuvable" });
});
// Listen
app.listen(port, () => {
  console.log(`Tourne sur le port : ${port}`);
});
