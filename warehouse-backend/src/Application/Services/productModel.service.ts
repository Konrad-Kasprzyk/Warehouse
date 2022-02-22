import { Inject, Injectable } from "@nestjs/common";
import { ProductModel } from "../../Domain/Model/ProductModel/productModel";
import { IUnitOfWork } from "../IUnitOfWork";

@Injectable()
export class ProductModelService {
  constructor(@Inject("IUnitOfWork") private readonly uow: IUnitOfWork) {}
  getAllProductModels(): Promise<ProductModel[]> {
    return this.uow.ProductModel.GetAllProductModels();
  }

  GetProductModel(id: number): Promise<ProductModel> {
    return this.uow.ProductModel.GetProductModel(id);
  }

  AddProductModel(name: string, brand: string, partNumber: string): Promise<ProductModel> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      return uow.ProductModel.AddProductModel(new ProductModel(partNumber, brand, name));
    });
  }

  RemoveProductModel(id: number): Promise<ProductModel> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      return await uow.ProductModel.RemoveProductModel(id);
    });
  }
}
