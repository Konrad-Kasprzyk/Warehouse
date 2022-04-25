import { Test, TestingModule } from '@nestjs/testing';
import { TestTypeORMModule } from '../../Infrastructure/TypeORM/testTypeorm.module';
import { HallService } from '../Services/hall.service';
import * as _ from 'lodash';
import { ProductModelService } from '../Services/productModel.service';
import { ShelfPurposes } from '../../Domain/Model/Hall/shelf';

describe('HallService', () => {
  let module: TestingModule;
  let hallService: HallService;
  let productModelService: ProductModelService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule],
      providers: [HallService, ProductModelService],
    }).compile();
    hallService = await module.resolve<HallService>(HallService);
    productModelService = await module.resolve<ProductModelService>(
      ProductModelService,
    );
  });

  it('should get a hall', async () => {
    const hall = await hallService.GetHall(1);

    expect(hall).toBeDefined();
    expect(hall).toBeDefined();
    expect(hall).toBeDefined();
    expect(hall).toBeDefined();
    expect(hall).toBeDefined();
  });

  it('should remove a hall', async () => {
    const hall = await hallService.RemoveHall(1);

    expect(hall).toBeDefined();
  });

  it('should return an array of all halls', async () => {
    const halls = await hallService.GetAllHalls();

    expect(halls).toBeDefined();
    expect(halls[0]).toBeDefined();
    expect(halls[0].Employees).toBeDefined();
    expect(halls[0].Products).toBeDefined();
    expect(halls[0].Shelves).toBeDefined();
    expect(halls[0].Tasks).toBeDefined();
    expect(halls.length).toBeGreaterThan(1);
  });

  it('should move employee to another hall', async () => {
    const hall = await hallService.MoveEmployeeToAnotherHall(1, 2);

    expect(hall).toBeDefined();
    expect(hall.Employees.find((employee) => employee.id == 1));
  });

  it('should not move employee to hall, because employee already is there', async () => {
    await expect(
      hallService.MoveEmployeeToAnotherHall(1, 1),
    ).rejects.toBeDefined();
  });

  it('should not move employee to hall, because employee is not found', async () => {
    await expect(
      hallService.MoveEmployeeToAnotherHall(142, 1),
    ).rejects.toBeDefined();
  });

  it('should not move employee to hall, because hall is not found', async () => {
    await expect(
      hallService.MoveEmployeeToAnotherHall(1, 42),
    ).rejects.toBeDefined();
  });

  it('should not move employee to hall, because arguments are improper', async () => {
    await expect(
      hallService.MoveEmployeeToAnotherHall(-42, 1),
    ).rejects.toBeDefined();
    await expect(
      hallService.MoveEmployeeToAnotherHall(1, -42),
    ).rejects.toBeDefined();
  });

  it('should not move employee to hall, because arguments are missing', async () => {
    await expect(
      hallService.MoveEmployeeToAnotherHall(null, 1),
    ).rejects.toBeDefined();
    await expect(
      hallService.MoveEmployeeToAnotherHall(1, null),
    ).rejects.toBeDefined();
  });

  it('should add hall', async () => {
    const hall = await hallService.AddHall(42);

    expect(hall).toBeDefined();
    expect(hall.Number).toEqual(42);
  });

  it('should not add hall because argument is improper', async () => {
    await expect(hallService.AddHall(null)).rejects.toBeDefined();
    await expect(hallService.AddHall(-42)).rejects.toBeDefined();
  });

  it('should not add hall because hall number will duplicate', async () => {
    await expect(hallService.AddHall(1)).rejects.toBeDefined();
  });

  it('should return an array of all shelves', async () => {
    const shelves = await hallService.GetAllShelves();

    expect(shelves).toBeDefined();
    expect(shelves[0]).toBeDefined();
    expect(shelves.length).toBeGreaterThan(1);
  });

  it('should return an array of all shelves from one hall', async () => {
    const hall = await hallService.GetHall(1);
    const shelves = await hallService.FilterShelves(hall.Number, null, null);

    hall.Shelves.forEach((shelf) =>
      expect(shelves.some((e) => _.isEqual(e, shelf))).toBeTruthy(),
    );
  });

  it('should return an array of all shelves with same product model', async () => {
    const productModel = await productModelService.GetProductModel(1);
    const shelves = await hallService.FilterShelves(null, 1, null);

    shelves.forEach((shelf) =>
      expect(shelf.ProductModelBrand).toEqual(productModel.Brand),
    );
    shelves.forEach((shelf) =>
      expect(shelf.ProductModelPartNumber).toEqual(productModel.PartNumber),
    );
  });

  it('should return an array of all shelves with same shelf purpose', async () => {
    const shelves = await hallService.FilterShelves(
      null,
      1,
      ShelfPurposes.Delivery,
    );

    shelves.forEach((shelf) =>
      expect(shelf.ShelfPurpose).toBe(ShelfPurposes.Delivery),
    );
  });

  it('should reject filter promise because of improper arguments', async () => {
    await expect(
      hallService.FilterShelves(-42, null, ShelfPurposes.Delivery),
    ).rejects.toBeDefined();
    await expect(
      hallService.FilterShelves(null, -42, ShelfPurposes.Delivery),
    ).rejects.toBeDefined();
    await expect(
      hallService.FilterShelves(null, null, 'wrong shelf purpose'),
    ).rejects.toBeDefined();
  });

  it('should get shelf', async () => {
    const shelves = await hallService.GetAllShelves();
    const shelf = await hallService.GetShelf(shelves[0].Gtin);

    expect(shelf).toBeDefined();
  });

  it('should remove shelf', async () => {
    const shelves = await hallService.GetAllShelves();
    const shelf = await hallService.RemoveShelf(shelves[0].Gtin);

    expect(shelf).toBeDefined();
  });

  it('should add shelf', async () => {
    const shelf = await hallService.AddShelf(
      1,
      42,
      'gtin42',
      ShelfPurposes.Delivery,
    );

    expect(shelf.Number).toEqual(42);
    expect(shelf.Gtin).toEqual('gtin42');
    expect(shelf.ShelfPurpose).toBe(ShelfPurposes.Delivery);
  });

  it('should not add shelf because arguments are improper', async () => {
    await expect(
      hallService.AddShelf(-1, 42, 'gtin42', ShelfPurposes.Delivery),
    ).rejects.toBeDefined();
    await expect(
      hallService.AddShelf(1, -42, 'gtin42', ShelfPurposes.Delivery),
    ).rejects.toBeDefined();
    await expect(
      hallService.AddShelf(1, 42, 'gtin42', 'wrong shelf purpose'),
    ).rejects.toBeDefined();
  });

  it('should not add shelf because arguments are missing', async () => {
    await expect(
      hallService.AddShelf(null, 42, 'gtin42', ShelfPurposes.Delivery),
    ).rejects.toBeDefined();
    await expect(
      hallService.AddShelf(1, null, 'gtin42', ShelfPurposes.Delivery),
    ).rejects.toBeDefined();
    await expect(
      hallService.AddShelf(1, 42, null, ShelfPurposes.Delivery),
    ).rejects.toBeDefined();
    await expect(
      hallService.AddShelf(1, 42, 'gtin42', null),
    ).rejects.toBeDefined();
  });

  it('should not add shelf because GTINs will duplicate', async () => {
    const shelf = (await hallService.FilterShelves(1, null, null))[0];

    await expect(
      hallService.AddShelf(1, 42, shelf.Gtin, shelf.ShelfPurpose),
    ).rejects.toBeDefined();
  });
});
