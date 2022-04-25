import { Inject, Injectable } from '@nestjs/common';
import { Hall } from '../../Domain/Model/Hall/hall';
import { Shelf, ShelfPurposes } from '../../Domain/Model/Hall/shelf';
import { ProductModel } from '../../Domain/Model/ProductModel/productModel';
import { IUnitOfWork } from '../IUnitOfWork';

@Injectable()
export class HallService {
  constructor(@Inject('IUnitOfWork') private readonly uow: IUnitOfWork) {}

  AddHall(hallNumber: number): Promise<Hall> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const hall = new Hall(hallNumber);
      return uow.Hall.AddHall(hall);
    });
  }

  RemoveHall(hallNumber: number): Promise<Hall> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      return uow.Hall.RemoveHall(hallNumber);
    });
  }

  GetAllHalls(): Promise<Hall[]> {
    return this.uow.Hall.GetAllHalls();
  }

  GetHall(hallNumber: number): Promise<Hall> {
    return this.uow.Hall.GetHall(hallNumber);
  }

  MoveEmployeeToAnotherHall(
    employeeId: number,
    newHallNumber: number,
  ): Promise<Hall> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const newHall = await uow.Hall.GetHall(newHallNumber);
      if (!newHall)
        return Promise.reject(`Hall with number ${newHallNumber} not found`);
      const employee = await uow.Employee.GetEmployee(employeeId);
      if (!employee)
        return Promise.reject(`Employee with id ${employeeId} not found`);
      const halls = await uow.Hall.GetAllHalls();
      const currentHall = halls.find((hall) =>
        hall.Employees.some((employee) => employee.id == employeeId),
      );
      if (currentHall.Number == newHallNumber)
        return Promise.reject(
          `Employee with id ${employeeId} is already in hall number ${newHallNumber}`,
        );
      const index = currentHall.Employees.findIndex(
        (employee) => employee.id == employeeId,
      );
      if (index < 0)
        return Promise.reject(
          `Employee with id ${employeeId} not found in hall`,
        );
      currentHall.Employees.splice(index, 1);
      newHall.Employees.push(employee);
      await uow.Hall.UpdateHall(currentHall);
      await uow.Hall.UpdateHall(newHall);
      return newHall;
    });
  }

  GetAllShelves(): Promise<Shelf[]> {
    return this.uow.Hall.GetAllShelves();
  }

  async FilterShelves(
    hallNumber: number,
    productModelId: number,
    shelfPurpose: string,
  ): Promise<Shelf[]> {
    let hall: Hall = null;
    let productModel: ProductModel = null;
    let castedShelfPurpose: ShelfPurposes = null;
    if (hallNumber) {
      hall = await this.uow.Hall.GetHall(hallNumber);
      if (!hall)
        return Promise.reject(`Hall with number ${hallNumber} not found`);
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
    if (shelfPurpose) {
      castedShelfPurpose = ShelfPurposes[shelfPurpose];
      if (!castedShelfPurpose) return Promise.reject('Invalid shelf puprose');
    }
    return this.uow.Hall.FilterShelves(hall, productModel, castedShelfPurpose);
  }

  GetShelf(gtin: string): Promise<Shelf> {
    return this.uow.Hall.GetShelf(gtin);
  }

  AddShelf(
    hallNumber: number,
    shelfNumber: number,
    gtin: string,
    shelfPurpose: string,
  ): Promise<Shelf> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      let castedShelfPurpose: ShelfPurposes = null;
      castedShelfPurpose = ShelfPurposes[shelfPurpose];
      if (!castedShelfPurpose) return Promise.reject('Invalid shelf puprose');
      const hall = await uow.Hall.GetHall(hallNumber);
      if (!hall)
        return Promise.reject(`Hall with number ${hallNumber} not found`);
      const shelf = await uow.Hall.AddShelf(
        new Shelf(shelfNumber, gtin, castedShelfPurpose),
      );
      hall.Shelves.push(shelf);
      await uow.Hall.UpdateHall(hall);
      return shelf;
    });
  }

  RemoveShelf(gtin: string): Promise<Shelf> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      return await uow.Hall.RemoveShelf(gtin);
    });
  }
}
