require("dotenv").config();
const mysql = require("mysql2/promise");

function getSslConfig() {
  if (!process.env.DB_SSL_CA) return undefined;

  const ca = process.env.DB_SSL_CA
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\\n/g, "\n");

  return {
    ca,
    rejectUnauthorized: true,
  };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: getSslConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
