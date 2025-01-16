const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "star-kid-change-starkid-change.j.aivencloud.com",
  port: "15742",
  user: "avnadmin",
  password: "AVNS_NrW_88_sD326XfB1JAD",
  database: "test_phan_quyen",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to keep the connection alive
function keepConnectionAlive() {
  pool.query("SELECT 1", (err, rows) => {
    if (err) {
      console.error("Error keeping connection alive:", err);
    } else {
      console.log("Connection kept alive");
    }
  });
}

// Set an interval to check the connection every 2 minutes (120000 milliseconds)
setInterval(keepConnectionAlive, 120000);

module.exports = {
  pool,
  keepConnectionAlive,
};
