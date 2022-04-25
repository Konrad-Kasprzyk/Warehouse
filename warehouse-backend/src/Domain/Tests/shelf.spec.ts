import { TestingModule, Test } from '@nestjs/testing';
import { IUnitOfWork } from '../../Application/IUnitOfWork';
import { TestTypeORMModule } from '../../Infrastructure/TypeORM/testTypeorm.module';
import { Shelf, ShelfPurposes } from '../Model/Hall/shelf';

describe('Shelf', () => {
  let module: TestingModule;
  let uow: IUnitOfWork;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule],
    }).compile();

    uow = await module.resolve<IUnitOfWork>('IUnitOfWork');
  });

  it('Shelf should be defined', () => {
    expect(new Shelf(1, 'gtin', ShelfPurposes.Storage)).toBeDefined();
  });

  it('should throw error', () => {
    expect(() => new Shelf(-1, 'gtin', ShelfPurposes.Storage)).toThrowError();
    expect(() => new Shelf(null, 'gtin', ShelfPurposes.Storage)).toThrowError();
    expect(() => new Shelf(1, null, ShelfPurposes.Storage)).toThrowError();
    expect(() => new Shelf(1, 'gtin', null)).toThrowError();
  });

  it('should add product to shelf', async () => {
    const shelves = await uow.Hall.GetAllShelves();
    const products = await uow.Product.GetAllProducts();
    const shelf = shelves.find((shelf) => !shelf.ProductModelBrand);
    const product = products[0];
    expect(shelf.AddProduct(product)).toBeTruthy();
    expect(shelf.ProductModelBrand).toBeDefined();
    expect(shelf.ProductModelPartNumber).toBeDefined();
    expect(shelf.ProductGtins).toHaveLength(1);
  });

  it('should not add duplicate product to shelf', async () => {
    const shelves = await uow.Hall.GetAllShelves();
    const products = await uow.Product.GetAllProducts();
    const shelf = shelves.find((shelf) => shelf.ProductModelBrand);
    const product = products.find(
      (product) => product.Gtin == shelf.ProductGtins[0],
    );
    const shelfGtinsNumber = shelf.ProductGtins.length;
    expect(shelf.AddProduct(product)).toBeFalsy();
    expect(shelf.ProductGtins).toHaveLength(shelfGtinsNumber);
  });

  it('should not add product with improper product model to shelf', async () => {
    const shelves = await uow.Hall.GetAllShelves();
    const products = await uow.Product.GetAllProducts();
    const shelf = shelves.find((shelf) => shelf.ProductModelBrand);
    const product = products.find(
      (product) => product.ProductModel.Brand != shelf.ProductModelBrand,
    );
    const shelfGtinsNumber = shelf.ProductGtins.length;
    expect(shelf.AddProduct(product)).toBeFalsy();
    expect(shelf.ProductGtins).toHaveLength(shelfGtinsNumber);
  });

  it('should set product model brand and part number to null and shelf products to an empty array', async () => {
    const shelves = await uow.Hall.GetAllShelves();
    const shelf = shelves.find((shelf) => shelf.ProductModelBrand);
    shelf.ClearShelf();
    expect(shelf.ProductModelBrand).toBeNull();
    expect(shelf.ProductModelPartNumber).toBeNull();
    expect(shelf.ProductGtins).toHaveLength(0);
  });
});
