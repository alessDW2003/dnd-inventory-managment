const pool = require("../database");

class ItemRepository {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM items");
    return rows;
  }

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);
    return rows[0];
  }

  async getByUserId(userId) {
    const [rows] = await pool.query("SELECT * FROM items WHERE userId = ?", [
      userId,
    ]);
    return rows;
  }

  async create(item) {
    const { name, description, type, quantity, favourite, userId } = item;
    const [result] = await pool.query(
      "INSERT INTO items (name, description, type, quantity, favourite, userId) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, type, quantity, favourite, userId]
    );
    return { id: result.insertId, ...item };
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    console.log("data", data);
    for (let key in data) {
      let value = data[key];

      if (value instanceof Date) {
        value = value.toISOString().slice(0, 19).replace("T", " ");
      }

      if (
        typeof value === "string" &&
        value.endsWith("Z") &&
        !isNaN(Date.parse(value))
      ) {
        value = new Date(value).toISOString().slice(0, 19).replace("T", " ");
      }

      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);

    const [result] = await pool.query(
      `UPDATE items SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;
    return this.getById(id);
  }

  async delete(id) {
    const item = await this.getById(id);
    if (!item) return null;
    await pool.query("DELETE FROM items WHERE id = ?", [id]);
    return item;
  }
}

module.exports = new ItemRepository();
