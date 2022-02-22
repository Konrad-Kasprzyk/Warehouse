import { Hall } from "../../Domain/Model/Hall/hall";
import { Shelf } from "../../Domain/Model/Hall/shelf";
import { Product } from "../../Domain/Model/Product/product";
import { ProductModel } from "../../Domain/Model/ProductModel/productModel";

export interface IProductRepository {
  GetProduct(gtin: string): Promise<Product>;

  GetAllProducts(): Promise<Product[]>;

  FilterProducts(
    hall: Hall,
    shelf: Shelf,
    productModel: ProductModel,
    productGtins: string[]
  ): Promise<Product[]>;

  AddProduct(product: Product): Promise<Product>;

  UpdateProduct(product: Product): Promise<Product>;

  RemoveProduct(gtin: string): Promise<Product>;
}
