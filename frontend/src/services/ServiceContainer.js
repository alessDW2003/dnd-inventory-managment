import ApiRepository from "./ApiRepository";
import getAllItemsByUserIdUseCase from "@/domain/useCases/GetAllItemsByUserIdUseCase";
import AddItemUseCase from "@/domain/useCases/items/AddItemUseCase";
import DeleteItemUseCase from "@/domain/useCases/items/DeleteItemUseCase";
import UpdateItemUseCase from "@/domain/useCases/items/UpdateItemUseCase";
import RegisterUserUseCase from "@/domain/useCases/users/RegisterUserUseCase";
import LogInUseCase from "@/domain/useCases/users/LoginUserUseCase";
import GetAllUsersUseCase from "@/domain/useCases/users/GetAllUsersUseCase";

class DependencyContainer {
  constructor() {
    this.repository = new ApiRepository();
    this.getAllItems = new getAllItemsByUserIdUseCase(this.repository);
    this.addItem = new AddItemUseCase(this.repository);
    this.deleteItem = new DeleteItemUseCase(this.repository);
    this.updateItem = new UpdateItemUseCase(this.repository);
    this.registerUser = new RegisterUserUseCase(this.repository);
    this.logInUser = new LogInUseCase(this.repository);
    this.getAllUsers = new GetAllUsersUseCase(this.repository);
  }

  getGetAllItems() {
    return this.getAllItems;
  }

  getAddItemUseCase() {
    return this.addItem;
  }

  getDeleteItemUseCase() {
    return this.deleteItem;
  }

  getUpdateItemUseCase() {
    return this.updateItem;
  }

  getRegisterUserUseCase() {
    return this.registerUser;
  }
  getLogInUserUseCase() {
    return this.logInUser;
  }

  getGetAllUsersUseCase() {
    return this.getAllUsers;
  }
}

export const container = new DependencyContainer();
