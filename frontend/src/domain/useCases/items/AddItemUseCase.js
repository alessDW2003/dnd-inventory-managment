export default class getAllItemsByUserIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(item) {
    const items = await this.repository.addItem(item);

    return items;
  }
}
