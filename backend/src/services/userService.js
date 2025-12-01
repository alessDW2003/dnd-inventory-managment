const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const JWT_SECRET = process.env.JWT_SECRET; // in productie: .env
const bcrypt = require("bcrypt");
const User = require("../models/User");

class UserService {
  async register(user) {
    if (!user.username || !user.password) {
      throw new Error("Alle velden zijn verplicht");
    }
    try {
      console.log(user)
      return await userRepository.createUser(user);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new Error("Username bestaat al");
      }
      throw err;
    }
  }

  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "supermegasterkesecret",
      { expiresIn: "1h" }
    );
    return { token, id: user.id, username: user.username };
  }

  async getAll() {
    try {
      const users = [];
      const userRaw = await userRepository.getAll();
      userRaw.forEach((user) => {
        users.push(new User(user.username, user.id, user.role));
      });
      console.log(users);
      return users;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
