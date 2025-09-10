export default class getAllItemsByUserIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(itemId) {
    const item = await this.repository.deleteItem(itemId);

    return item;
  }
}
