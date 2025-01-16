const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const route = require("./routers/index");
const { pool, keepConnectionAlive } = require("./configuration/dbConfig");
const path = require("path");

const bcrypt = require("bcrypt");

// // Hash the password directly and print it to the console
// const password = '123';
// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Hashed password:", hash); // Print the hashed password
// });
  
  dotenv.config();
const app = express();
const port = process.env.PORT || 8088;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD"],
    credentials: true,
  })
);

// Serve static files if needed
// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

route(app);

// Keep the connection alive
keepConnectionAlive();

app.listen(port, () => {
  console.log("Server is running on port: " + port);
  
});
