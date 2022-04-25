import { IHallRepository } from '../../../Application/Repositories/IHallRepository';
import { ShelfPurposes } from '../../../Domain/Model/Hall/shelf';
import { EntityManager, Repository } from 'typeorm';
import { Hall } from '../Entities/Hall.entity';
import { ProductModel } from '../Entities/ProductModel.entity';
import { Shelf } from '../Entities/Shelf.entity';

export class HallRepo implements IHallRepository {
  constructor(entityManager: EntityManager) {
    this.hallRepository = entityManager.getRepository<Hall>(Hall);
    this.shelfRepository = entityManager.getRepository<Shelf>(Shelf);
  }
  private hallRepository: Repository<Hall>;
  private shelfRepository: Repository<Shelf>;

  UpdateHall(hall: Hall): Promise<Hall> {
    return this.hallRepository.save(hall);
  }

  UpdateShelf(shelf: Shelf): Promise<Shelf> {
    return this.shelfRepository.save(shelf);
  }

  AddHall(hall: Hall): Promise<Hall> {
    const newHall = this.hallRepository.create(hall);
    return this.hallRepository.save(newHall);
  }

  async RemoveHall(hallNumber: number): Promise<Hall> {
    const hall = await this.hallRepository.findOne({ Number: hallNumber });
    if (!hall)
      return Promise.reject(`Hall with number ${hallNumber} not found`);
    return await this.hallRepository.remove(hall);
  }

  GetAllHalls(): Promise<Hall[]> {
    return this.hallRepository.find();
  }

  GetHall(hallNumber: number): Promise<Hall> {
    return this.hallRepository.findOne({ Number: hallNumber });
  }

  GetAllShelves(): Promise<Shelf[]> {
    return this.shelfRepository.find();
  }

  FilterShelves(
    hall: Hall,
    productModel: ProductModel,
    shelfPurpose: ShelfPurposes,
  ): Promise<Shelf[]> {
    let query: {
      Hall?: Hall;
      ProductModelPartNumber?: string;
      ProductModelBrand?: string;
      ShelfPurpose?: ShelfPurposes;
    } = {};
    if (hall) query.Hall = hall;
    if (productModel) {
      query.ProductModelPartNumber = productModel.PartNumber;
      query.ProductModelBrand = productModel.Brand;
    }
    if (shelfPurpose) query.ShelfPurpose = shelfPurpose;
    return this.shelfRepository.find(query);
  }

  GetShelf(gtin: string): Promise<Shelf> {
    return this.shelfRepository.findOne({ Gtin: gtin });
  }

  AddShelf(shelf: Shelf): Promise<Shelf> {
    const newShelf = this.shelfRepository.create(shelf);
    return this.shelfRepository.save(newShelf);
  }

  async RemoveShelf(gtin: string): Promise<Shelf> {
    const shelf = await this.shelfRepository.findOne({ Gtin: gtin });
    if (!shelf) return Promise.reject(`Shelf with gtin ${gtin} not found`);
    return await this.shelfRepository.remove(shelf);
  }
}
