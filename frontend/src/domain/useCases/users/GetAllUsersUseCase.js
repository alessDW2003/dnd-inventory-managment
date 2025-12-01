import User from "@/domain/model/User";
import { Roles } from "@/constants/Roles";
export default class getAllItemsByUserIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    const usersRaw = await this.repository.getAllUsers();
    console.log(usersRaw);
    const users = [];
    usersRaw.forEach((user) => {
      const newUser = new User(user.username, null, user.role);
      if (user.role === Roles.DM) newUser.setRole("dm");
      users.push(newUser);
    });
    console.log(users);
    return users;
  }
}
