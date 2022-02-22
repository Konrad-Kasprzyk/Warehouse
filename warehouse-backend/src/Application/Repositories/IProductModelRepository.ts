import { ProductModel } from "../../Domain/Model/ProductModel/productModel";

export interface IProductModelRepository {
  GetProductModel(id: number): Promise<ProductModel>;

  GetAllProductModels(): Promise<ProductModel[]>;

  AddProductModel(productModel: ProductModel): Promise<ProductModel>;

  UpdateProductModel(productModel: ProductModel): Promise<ProductModel>;

  RemoveProductModel(id: number): Promise<ProductModel>;
}
