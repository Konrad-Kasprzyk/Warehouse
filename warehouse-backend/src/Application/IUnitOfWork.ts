import { IEmployeeRepository } from "./Repositories/IEmployeeRepository";
import { IHallRepository } from "./Repositories/IHallRepository";
import { IProductModelRepository } from "./Repositories/IProductModelRepository";
import { IProductRepository } from "./Repositories/IProductRepository";
import { ITaskRepository } from "./Repositories/ITaskRepository";

export interface IUnitOfWork {
  /** If an error is thrown or the promise is rejected on the callback,
   *  the transaction will be rolled back. Callback must use argument "uow"
   *  as unit of work.*/
  InTransaction<T>(callback: (uow: IUnitOfWork) => Promise<T>): Promise<T>;

  readonly Employee: IEmployeeRepository;
  readonly Hall: IHallRepository;
  readonly ProductModel: IProductModelRepository;
  readonly Product: IProductRepository;
  readonly Task: ITaskRepository;
}
