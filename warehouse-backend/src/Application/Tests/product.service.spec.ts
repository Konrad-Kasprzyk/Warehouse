import { Test, TestingModule } from '@nestjs/testing';
import * as _ from 'lodash';
import { TestTypeORMModule } from '../../Infrastructure/TypeORM/testTypeorm.module';
import { HallService } from '../Services/hall.service';
import { ProductService } from '../Services/product.service';
import { ProductModelService } from '../Services/productModel.service';

describe('ProductService', () => {
  let module: TestingModule;
  let hallService: HallService;
  let productService: ProductService;
  let productModelService: ProductModelService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule],
      providers: [HallService, ProductService, ProductModelService],
    }).compile();
    hallService = await module.resolve<HallService>(HallService);
    productService = await module.resolve<ProductService>(ProductService);
    productModelService = await module.resolve<ProductModelService>(
      ProductModelService,
    );
  });
  it('should get product', async () => {
    const products = await productService.GetAllProducts();
    const product = await productService.GetProduct(products[0].Gtin);

    expect(product).toBeDefined();
    expect(product.ProductModel).toBeDefined();
  });

  it('should return an array of all products from one hall', async () => {
    const hall = await hallService.GetHall(1);
    const filteredProducts = await productService.FilterProducts(
      1,
      null,
      null,
      null,
    );

    hall.Products.forEach((product) =>
      expect(filteredProducts.some((e) => _.isEqual(e, product))).toBeTruthy(),
    );
  });

  it('should return an array of all products from one shelf', async () => {
    const hall = await hallService.GetHall(1);
    const shelf = hall.Shelves[0];
    const filteredProducts = await productService.FilterProducts(
      null,
      shelf.Gtin,
      null,
      null,
    );

    shelf.ProductGtins.forEach((productGtin) =>
      expect(filteredProducts.some((e) => e.Gtin == productGtin)).toBeTruthy(),
    );
  });

  it('should return an array of all products with same product number', async () => {
    const productModel = await productModelService.GetProductModel(1);
    const filteredProducts = await productService.FilterProducts(
      null,
      null,
      1,
      null,
    );

    filteredProducts.forEach((product) =>
      expect(_.isEqual(product.ProductModel, productModel)).toBeTruthy(),
    );
  });

  it('should return an array of concrete products based on GTIN', async () => {
    const productGtins = (await productService.GetAllProducts())
      .splice(0, 10)
      .map((product) => product.Gtin);
    const filteredProducts = await productService.FilterProducts(
      null,
      null,
      null,
      productGtins,
    );

    productGtins.forEach((gtin) =>
      expect(
        filteredProducts.some((product) => product.Gtin == gtin),
      ).toBeTruthy(),
    );
  });

  it('should return an array of all products', async () => {
    const products = await productService.GetAllProducts();

    expect(products).toBeDefined();
    expect(products[0]).toBeDefined();
    expect(products[0].ProductModel).toBeDefined();
    expect(products.length).toBeGreaterThan(1);
  });

  it('should remove product', async () => {
    const products = await productService.GetAllProducts();
    const product = await productService.RemoveProduct(products[0].Gtin);

    expect(product).toBeDefined();
  });

  it('should add product', async () => {
    const productModel = await productModelService.GetProductModel(1);
    const shelf = (await hallService.FilterShelves(null, 1, null))[0];
    const product = await productService.AddProduct(1, shelf.Gtin, 1, 'gtin42');

    expect(product).toBeDefined();
    expect(product.ProductModel.Brand).toEqual(productModel.Brand);
    expect(product.ProductModel.PartNumber).toEqual(productModel.PartNumber);
  });

  it('should not add product because arguments are improper', async () => {
    const shelf = (await hallService.GetAllShelves())[0];

    await expect(
      productService.AddProduct(-42, shelf.Gtin, 1, 'gtin42'),
    ).rejects.toBeDefined();
    await expect(
      productService.AddProduct(1, 'not existing shelf GTIN', 1, 'gtin42'),
    ).rejects.toBeDefined();
    await expect(
      productService.AddProduct(1, shelf.Gtin, -42, 'gtin42'),
    ).rejects.toBeDefined();
  });

  it('should not add product because arguments are missing', async () => {
    const shelf = (await hallService.GetAllShelves())[0];

    await expect(
      productService.AddProduct(null, shelf.Gtin, 1, 'gtin42'),
    ).rejects.toBeDefined();
    await expect(
      productService.AddProduct(1, null, 1, 'gtin42'),
    ).rejects.toBeDefined();
    await expect(
      productService.AddProduct(1, shelf.Gtin, null, 'gtin42'),
    ).rejects.toBeDefined();
    await expect(
      productService.AddProduct(1, shelf.Gtin, 1, null),
    ).rejects.toBeDefined();
  });

  it('should not add product because GTINs will duplicate', async () => {
    const shelf = (await hallService.FilterShelves(1, null, null))[0];
    const product = (
      await productService.FilterProducts(1, shelf.Gtin, null, null)
    )[0];
    const productModelId = product.ProductModel.id;

    await expect(
      productService.AddProduct(1, shelf.Gtin, productModelId, product.Gtin),
    ).rejects.toBeDefined();
  });
});
