import { Hall } from '../../Domain/Model/Hall/hall';
import { Shelf, ShelfPurposes } from '../../Domain/Model/Hall/shelf';
import { ProductModel } from '../../Domain/Model/ProductModel/productModel';

export interface IHallRepository {
  AddHall(hall: Hall): Promise<Hall>;

  UpdateHall(hall: Hall): Promise<Hall>;

  RemoveHall(hallNumber: number): Promise<Hall>;

  GetAllHalls(): Promise<Hall[]>;

  GetHall(hallNumber: number): Promise<Hall>;

  GetAllShelves(): Promise<Shelf[]>;

  FilterShelves(
    hall: Hall,
    productModel: ProductModel,
    shelfPurpose: ShelfPurposes,
  ): Promise<Shelf[]>;

  GetShelf(gtin: string): Promise<Shelf>;

  AddShelf(shelf: Shelf): Promise<Shelf>;

  UpdateShelf(shelf: Shelf): Promise<Shelf>;

  RemoveShelf(gtin: string): Promise<Shelf>;
}
