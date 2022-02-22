import { IProductRepository } from "../../../Application/Repositories/IProductRepository";
import { EntityManager, FindOperator, In, Repository } from "typeorm";
import { Hall } from "../Entities/Hall.entity";
import { Product } from "../Entities/Product.entity";
import { ProductModel } from "../Entities/ProductModel.entity";
import { Shelf } from "../Entities/Shelf.entity";

export class ProductRepo implements IProductRepository {
  constructor(entityManager: EntityManager) {
    this.productRepository = entityManager.getRepository<Product>(Product);
  }
  private productRepository: Repository<Product>;

  UpdateProduct(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  GetProduct(gtin: string): Promise<Product> {
    return this.productRepository.findOne({ Gtin: gtin });
  }

  GetAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  FilterProducts(
    hall: Hall,
    shelf: Shelf,
    productModel: ProductModel,
    productGtins: string[]
  ): Promise<Product[]> {
    let query: {
      Hall?: Hall;
      Gtin?: FindOperator<string>;
      ProductModel?: ProductModel;
    } = {};
    if (hall) query.Hall = hall;
    if (productModel) query.ProductModel = productModel;
    let searchedGtins: string[] = [];
    if (shelf) searchedGtins.push(...shelf.ProductGtins);
    if (productGtins) searchedGtins.push(...productGtins);
    if (searchedGtins.length > 0) query.Gtin = In(searchedGtins);
    return this.productRepository.find(query);
  }

  AddProduct(product: Product): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async RemoveProduct(gtin: string): Promise<Product> {
    const product = await this.productRepository.findOne({ Gtin: gtin });
    if (!product) return Promise.reject(`Product with GTIN ${gtin} not found`);
    return await this.productRepository.remove(product);
  }
}
