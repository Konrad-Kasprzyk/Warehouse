import { Inject, Injectable } from '@nestjs/common';
import { Hall } from '../../Domain/Model/Hall/hall';
import { Shelf } from '../../Domain/Model/Hall/shelf';
import { Product } from '../../Domain/Model/Product/product';
import { ProductModel } from '../../Domain/Model/ProductModel/productModel';
import { IUnitOfWork } from '../IUnitOfWork';

@Injectable()
export class ProductService {
  constructor(@Inject('IUnitOfWork') private readonly uow: IUnitOfWork) {}

  GetProduct(gtin: string): Promise<Product> {
    return this.uow.Product.GetProduct(gtin);
  }

  async FilterProducts(
    hallNumber: number,
    shelfGtin: string,
    productModelId: number,
    productGtins: string[],
  ): Promise<Product[]> {
    let hall: Hall = null;
    let shelf: Shelf = null;
    let productModel: ProductModel = null;
    if (hallNumber) {
      hall = await this.uow.Hall.GetHall(hallNumber);
      if (!hall)
        return Promise.reject(`Hall with number ${hallNumber} not found`);
    }
    if (shelfGtin) {
      shelf = await this.uow.Hall.GetShelf(shelfGtin);
      if (!shelf)
        return Promise.reject(`Shelf with GTIN ${shelfGtin} not found`);
    }
    if (productModelId) {
      productModel = await this.uow.ProductModel.GetProductModel(
        productModelId,
      );
      if (!productModel)
        return Promise.reject(
          `Product model with id ${productModelId} not found`,
        );
    }
    return this.uow.Product.FilterProducts(
      hall,
      shelf,
      productModel,
      productGtins,
    );
  }

  GetAllProducts(): Promise<Product[]> {
    return this.uow.Product.GetAllProducts();
  }

  AddProduct(
    hallNumber: number,
    shelfGtin: string,
    productModelId: number,
    productGtin: string,
  ): Promise<Product> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const hall = await uow.Hall.GetHall(hallNumber);
      if (!hall)
        return Promise.reject(`Hall with number ${hallNumber} not found`);
      const shelf = hall.Shelves.find((shelf) => shelf.Gtin == shelfGtin);
      if (!shelf)
        return Promise.reject(
          `Shelf with GTIN ${shelfGtin} not found in hall with number ${hallNumber}`,
        );
      const productModel = await uow.ProductModel.GetProductModel(
        productModelId,
      );
      if (!productModel)
        return Promise.reject(
          `Product model with id ${productModelId} not found`,
        );

      const product = await uow.Product.AddProduct(
        new Product(productModel, productGtin),
      );
      if (!shelf.AddProduct(product))
        return Promise.reject(
          `Improper shelf. Can't add this product to shelf`,
        );
      hall.Products.push(product);
      await uow.Hall.UpdateShelf(shelf);
      await uow.Hall.UpdateHall(hall);
      return product;
    });
  }

  RemoveProduct(gtin: string): Promise<Product> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      return await uow.Product.RemoveProduct(gtin);
    });
  }
}
