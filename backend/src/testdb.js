const pool = require("./src/database");

async function test() {
  try {
    const [rows] = await pool.query("SELECT 1+1 AS result");
    console.log("Connection successful:", rows);
  } catch (err) {
    console.error(err);
  }
}

test();
