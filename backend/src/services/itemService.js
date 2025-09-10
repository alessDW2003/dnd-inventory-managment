const itemRepository = require("../repositories/itemRepository");

class ItemService {
  getAllItems() {
    return itemRepository.getAll();
  }

  getItem(id) {
    return itemRepository.getById(id);
  }

  getItemByUserId(userId) {
    return itemRepository.getByUserId(userId);
  }

  createItem(data) {
    return itemRepository.create(data);
  }

  updateItem(id, data) {
    return itemRepository.update(id, data);
  }

  deleteItem(id) {
    return itemRepository.delete(id);
  }
}

module.exports = new ItemService();
