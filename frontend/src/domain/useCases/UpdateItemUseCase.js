export default class getAllItemsByUserIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(item) {
    const itemRaw = await this.repository.updateItem(item);

    return itemRaw;
  }
}
