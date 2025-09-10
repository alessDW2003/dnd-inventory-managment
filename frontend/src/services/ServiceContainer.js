import ApiRepository from "./ApiRepository";
import getAllItemsByUserIdUseCase from "@/domain/useCases/GetAllItemsByUserIdUseCase";
import AddItemUseCase from "@/domain/useCases/AddItemUseCase";
import DeleteItemUseCase from "@/domain/useCases/DeleteItemUseCase";
import UpdateItemUseCase from "@/domain/useCases/UpdateItemUseCase";
import RegisterUserUseCase from "@/domain/useCases/RegisterUserUseCase";

class DependencyContainer {
  constructor() {
    this.repository = new ApiRepository();
    this.getAllItems = new getAllItemsByUserIdUseCase(this.repository);
    this.addItem = new AddItemUseCase(this.repository);
    this.deleteItem = new DeleteItemUseCase(this.repository);
    this.updateItem = new UpdateItemUseCase(this.repository);
    this.registerUser = new RegisterUserUseCase(this.repository);
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
}

export const container = new DependencyContainer();
