const pool = require("../database");
const bcrypt = require("bcrypt");

class UserRepository {
  async createUser(user) {
    const hash = await bcrypt.hash(user.password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [user.username, hash, user.role]
    );
    return { id: result.insertId, username: user.username };
  }

  async findByUsername(username) {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  }

  async getAll() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  }
}
module.exports = new UserRepository();
