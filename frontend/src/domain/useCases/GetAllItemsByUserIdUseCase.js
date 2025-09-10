import Item from "../model/item";
export default class getAllItemsByUserIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(userId) {
    const itemsRaw = await this.repository.getAllItemsByUserId(userId);
    console.log(itemsRaw);
    const items = [];
    itemsRaw.forEach((item) => {
      items.push(
        new Item(
          item.id,
          item.name,
          item.description,
          item.type,
          item.userId,
          item.quantity,
          item.created_at,
          item.favourite
        )
      );
    });
    return items;
  }
}
