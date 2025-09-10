import DnDRepository from "@/domain/repository/DnDRepository";
import Client from "@/libraries/Client";

export default class ApiRepository extends DnDRepository {
  async getAllItemsByUserId(userId) {
    return Client.getAll(`items/user/${userId}`);
  }

  async addItem(item) {
    return Client.post(`items`, item);
  }

  async deleteItem(itemId) {
    return Client.delete(`items/${itemId}`);
  }

  async updateItem(item) {
    return Client.put("items", item.id, item);
  }
}
