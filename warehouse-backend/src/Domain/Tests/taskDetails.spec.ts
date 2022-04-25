import { TestingModule, Test } from '@nestjs/testing';
import { IUnitOfWork } from '../../Application/IUnitOfWork';
import { TestTypeORMModule } from '../../Infrastructure/TypeORM/testTypeorm.module';
import { Shelf, ShelfPurposes } from '../Model/Hall/shelf';
import { Product } from '../Model/Product/product';
import { ProductModel } from '../Model/ProductModel/productModel';
import { TaskStatuses } from '../Model/Task/task';
import { TaskDetails } from '../Model/Task/taskDetails';

describe('TaskDetails', () => {
  let module: TestingModule;
  let uow: IUnitOfWork;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule],
    }).compile();

    uow = await module.resolve<IUnitOfWork>('IUnitOfWork');
  });

  it('should be defined', () => {
    const startShelf = new Shelf(1, 'gtin', ShelfPurposes.Delivery);
    startShelf.AddProduct(
      new Product(new ProductModel('partNumber', 'brand', 'name'), 'gtin'),
    );
    const destinationShelf = new Shelf(2, 'gtin2', ShelfPurposes.Storage);
    const taskDetails = new TaskDetails(1, startShelf, destinationShelf);
    expect(taskDetails).toBeDefined();
  });

  it('should throw error', () => {
    const startShelf = new Shelf(1, 'gtin', ShelfPurposes.Delivery);
    startShelf.AddProduct(
      new Product(new ProductModel('partNumber', 'brand', 'name'), 'gtin'),
    );
    const emptyStartShelf = new Shelf(1, 'gtin', ShelfPurposes.Delivery);
    const destinationShelf = new Shelf(2, 'gtin2', ShelfPurposes.Storage);
    const destinationShelfImproperProductModel = new Shelf(
      3,
      'gtin3',
      ShelfPurposes.Storage,
    );
    destinationShelfImproperProductModel.AddProduct(
      new Product(new ProductModel('partNumber2', 'brand2', 'name2'), 'gtin4'),
    );

    expect(
      () => new TaskDetails(-1, startShelf, destinationShelf),
    ).toThrowError();
    expect(
      () => new TaskDetails(null, startShelf, destinationShelf),
    ).toThrowError();
    expect(
      () => new TaskDetails(1, emptyStartShelf, destinationShelf),
    ).toThrowError();
    expect(
      () =>
        new TaskDetails(1, startShelf, destinationShelfImproperProductModel),
    ).toThrowError();
  });

  it('should accept shelf and product scan', async () => {
    const activeTaskDetails = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Active, null)
    ).map((task) => task.TaskDetails);
    const taskDetails = activeTaskDetails.find(
      (taskDetails) =>
        taskDetails.PickedUpProductsGtins.length > 0 &&
        taskDetails.StoredProductsGtins.length == 0,
    );
    const destinationShelf = await uow.Hall.GetShelf(
      taskDetails.DestinationShelfGtin,
    );
    const productToStore = await uow.Product.GetProduct(
      taskDetails.PickedUpProductsGtins[0],
    );

    expect(taskDetails.ScanShelf(destinationShelf)).toBeTruthy();
    expect(taskDetails.ScanProduct(productToStore)).toBeTruthy();
    expect(taskDetails.StoredProductsGtins).toHaveLength(1);
  });

  it('should reject shelf scan', async () => {
    const activeTaskDetails = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Active, null)
    ).map((task) => task.TaskDetails);
    const productModels = await uow.ProductModel.GetAllProductModels();
    const taskDetails = activeTaskDetails[0];
    const improperProductModel = productModels.find(
      (p) =>
        p.Brand != taskDetails.ProductModelBrand &&
        p.PartNumber != taskDetails.ProductModelPartNumber,
    );
    const improperShelf = await uow.Hall.FilterShelves(
      null,
      improperProductModel,
      ShelfPurposes.Delivery,
    )[0];
    let scannedShelfGtin = taskDetails.ScannedShelfGtin;

    expect(taskDetails.ScanShelf(improperShelf)).toBeFalsy();
    expect(taskDetails.ScannedShelfGtin).toEqual(scannedShelfGtin);
  });

  it("should reject product scan because product model don't match", async () => {
    const activeTaskDetails = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Active, null)
    ).map((task) => task.TaskDetails);
    const productModels = await uow.ProductModel.GetAllProductModels();
    const taskDetails = activeTaskDetails.find(
      (taskDetails) =>
        taskDetails.PickedUpProductsGtins.length > 0 &&
        taskDetails.StoredProductsGtins.length == 0,
    );
    const destinationShelf = await uow.Hall.GetShelf(
      taskDetails.DestinationShelfGtin,
    );
    const improperProductModel = productModels.find(
      (p) =>
        p.Brand != taskDetails.ProductModelBrand &&
        p.PartNumber != taskDetails.ProductModelPartNumber,
    );
    const improperProduct = await uow.Product.FilterProducts(
      null,
      null,
      improperProductModel,
      null,
    )[0];

    expect(taskDetails.ScanShelf(destinationShelf)).toBeTruthy();
    expect(taskDetails.ScanProduct(improperProduct)).toBeFalsy();
  });

  it('should reject product scan because it will be too much scanned products', async () => {
    const activeTaskDetails = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Active, null)
    ).map((task) => task.TaskDetails);
    const productModels = await uow.ProductModel.GetAllProductModels();
    const taskDetails = activeTaskDetails.find(
      (taskDetails) =>
        taskDetails.PickedUpProductsGtins.length == taskDetails.ScansRequired,
    );
    const startingShelf = await uow.Hall.GetShelf(
      taskDetails.StartingShelfGtin,
    );
    const productModel = productModels.find(
      (p) =>
        p.Brand == taskDetails.ProductModelBrand &&
        p.PartNumber == taskDetails.ProductModelPartNumber,
    );
    const products = await uow.Product.FilterProducts(
      null,
      null,
      productModel,
      null,
    );
    const notAddedProduct = products.filter(
      (p) => !taskDetails.PickedUpProductsGtins.includes(p.Gtin),
    )[0];

    expect(taskDetails.ScanShelf(startingShelf)).toBeTruthy();
    expect(taskDetails.ScanProduct(notAddedProduct)).toBeFalsy();
    expect(taskDetails.PickedUpProductsGtins).toHaveLength(
      taskDetails.ScansRequired,
    );
  });

  it('should return that task is completed', async () => {
    const activeTaskDetails = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Active, null)
    ).map((task) => task.TaskDetails);
    const taskDetails = activeTaskDetails.find(
      (taskDetails) =>
        taskDetails.StoredProductsGtins.length == taskDetails.ScansRequired,
    );

    expect(taskDetails.IsCompleted()).toBeTruthy();
  });

  it('should return that task is not completed', async () => {
    const activeTaskDetails = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Active, null)
    ).map((task) => task.TaskDetails);
    const taskDetails = activeTaskDetails.find(
      (taskDetails) =>
        taskDetails.StoredProductsGtins.length != taskDetails.ScansRequired,
    );

    expect(taskDetails.IsCompleted()).toBeFalsy();
  });
});
