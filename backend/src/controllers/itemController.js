const itemService = require("../services/itemService");

class ItemController {
  async getAll(req, res) {
    const items = await itemService.getAllItems();
    res.json(items);
  }

  async getById(req, res) {
    const item = await itemService.getItem(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  }

  async getByUserId(req, res) {
    console.log("userId", req.body);
    const items = await itemService.getItemByUserId(Number(req.params.userId));
    if (!items) return res.status(404).json({ message: "Items not found" });
    res.json(items);
  }

  async create(req, res) {
    console.log("create", req.body);
    const { name, description, type, quantity, favourite, userId } = req.body;
    const item = await itemService.createItem({
      name,
      description,
      type,
      quantity,
      favourite,
      userId,
    });
    res.status(201).json(item);
  }

  async update(req, res) {
    console.log("update", req.body);
    const item = await itemService.updateItem(Number(req.params.id), req.body);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  }

  async delete(req, res) {
    const item = await itemService.deleteItem(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  }
}

module.exports = new ItemController();
