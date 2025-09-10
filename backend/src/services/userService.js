const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const JWT_SECRET = process.env.JWT_SECRET; // in productie: .env
const bcrypt = require("bcrypt");

class UserService {
  async register(user) {
    // validatie
    if (!user.username || !user.password) {
      throw new Error("Alle velden zijn verplicht");
    }
    try {
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
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { token, id: user.id, username: user.username };
  }
}

module.exports = UserService;
