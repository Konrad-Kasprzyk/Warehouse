import { Test, TestingModule } from '@nestjs/testing';
import { TestTypeORMModule } from '../../Infrastructure/TypeORM/testTypeorm.module';
import { ProductModelService } from '../Services/productModel.service';

describe('ProductModelService', () => {
  let module: TestingModule;
  let productModelService: ProductModelService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule],
      providers: [ProductModelService],
    }).compile();
    productModelService = await module.resolve<ProductModelService>(
      ProductModelService,
    );
  });

  it('should return an array of all product models', async () => {
    const productModels = await productModelService.getAllProductModels();

    expect(productModels).toBeDefined();
    expect(productModels[0]).toBeDefined();
    expect(productModels.length).toBeGreaterThan(1);
  });

  it('should get product model', async () => {
    const productModel = await productModelService.GetProductModel(1);

    expect(productModel).toBeDefined();
  });

  it('should remove product model', async () => {
    const productModel = await productModelService.RemoveProductModel(1);

    expect(productModel).toBeDefined();
  });

  it('should add product model', async () => {
    const productModel = await productModelService.AddProductModel(
      'name',
      'brand',
      'part number',
    );

    expect(productModel).toBeDefined();
    expect(productModel.Name).toEqual('name');
    expect(productModel.Brand).toEqual('brand');
    expect(productModel.PartNumber).toEqual('part number');
  });

  it('should not add product model because arguments are missing', async () => {
    await expect(
      productModelService.AddProductModel(null, 'brand', 'part number'),
    ).rejects.toBeDefined();
    await expect(
      productModelService.AddProductModel('name', null, 'part number'),
    ).rejects.toBeDefined();
    await expect(
      productModelService.AddProductModel('name', 'brand', null),
    ).rejects.toBeDefined();
  });
});
