const UserService = require("../services/userService");
const service = new UserService();

class UserController {
  async register(req, res) {
    try {
      const user = await service.register(req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await service.login(username, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async profile(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "No token" });

      const token = authHeader.split(" ")[1];
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, "supersecretkey");
      res.json({ id: decoded.id, username: decoded.username });
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}

module.exports = new UserController();
