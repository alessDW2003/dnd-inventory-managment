export default class DnDRepository {
  getAllItemsByUserId(userId) {
    throw new Error("method not implemented", userId);
  }

  addItem(item) {
    throw new Error("method not implemented", item.id);
  }

  deleteItem(itemId) {
    throw new Error("method not implemented", itemId);
  }

  updateItem(item) {
    throw new Error("method not implemented", item.id);
  }
}
