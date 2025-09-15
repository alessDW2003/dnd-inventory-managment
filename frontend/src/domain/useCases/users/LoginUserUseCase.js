export default class LogInUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(user) {
    try {
      const loggedInUser = await this.repository.logInUser(user);
      return loggedInUser;
    } catch (err) {
      throw err;
    }
  }
}
