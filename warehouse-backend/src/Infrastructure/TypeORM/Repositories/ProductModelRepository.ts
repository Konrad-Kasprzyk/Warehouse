import { IProductModelRepository } from '../../../Application/Repositories/IProductModelRepository';
import { EntityManager, Repository } from 'typeorm';
import { ProductModel } from '../Entities/ProductModel.entity';

export class ProductModelRepo implements IProductModelRepository {
  constructor(entityManager: EntityManager) {
    this.productModelRepository =
      entityManager.getRepository<ProductModel>(ProductModel);
  }
  private productModelRepository: Repository<ProductModel>;

  UpdateProductModel(productModel: ProductModel): Promise<ProductModel> {
    return this.productModelRepository.save(productModel);
  }

  GetProductModel(id: number): Promise<ProductModel> {
    return this.productModelRepository.findOne({ id: id });
  }

  AddProductModel(productModel: ProductModel): Promise<ProductModel> {
    const newProductModel = this.productModelRepository.create(productModel);
    return this.productModelRepository.save(newProductModel);
  }

  async RemoveProductModel(id: number): Promise<ProductModel> {
    const productModel = await this.productModelRepository.findOne({ id: id });
    if (!productModel)
      return Promise.reject(`Product model with id ${id} not found`);
    return await this.productModelRepository.remove(productModel);
  }

  GetAllProductModels(): Promise<ProductModel[]> {
    return this.productModelRepository.find();
  }
}
