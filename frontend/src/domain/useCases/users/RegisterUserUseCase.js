export default class RegisterUserUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(user) {
    console.log(user);
    if (!validateUser(user)) return;

    try {
      const createdUser = await this.repository.registerUser(user);
      return createdUser;
    } catch (err) {
      // Hier vangen we DB-specifieke fouten op en vertalen ze
      if (err.code === "ER_DUP_ENTRY") {
        throw new Error("Username bestaat al"); // business-friendly message
      }
      throw err; // andere errors doorgeven
    }
  }
}

function validateUser(user) {
  if (!user.username || !user.password) {
    alert("Vul alle velden in!");
    return false;
  }
  if (user.password.length < 8) {
    alert("Wachtwoord moet minstens 8 tekens zijn");
    return false;
  }
  return true;
}
