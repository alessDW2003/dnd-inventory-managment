export default class RegisterUserUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(user) {
    const user = this.repository.registerUser(user);
    return user;
  }
}
