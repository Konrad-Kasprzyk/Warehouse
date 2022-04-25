import { Injectable } from '@nestjs/common';
import { Connection, getConnection, QueryRunner } from 'typeorm';
import { IUnitOfWork } from '../../Application/IUnitOfWork';
import { EmployeeRepo } from './Repositories/EmployeeRepository';
import { HallRepo } from './Repositories/HallRepository';
import { ProductModelRepo } from './Repositories/ProductModelRepository';
import { ProductRepo } from './Repositories/ProductRepository';
import { TaskRepo } from './Repositories/TaskRepository';

@Injectable()
export class TestTypeOrmUoW implements IUnitOfWork {
  constructor(readonly connection: Connection) {
    this.queryRunner = connection.createQueryRunner();
  }
  private _employee: EmployeeRepo;
  private _hall: HallRepo;
  private _product: ProductRepo;
  private _productModel: ProductModelRepo;
  private _task: TaskRepo;
  private queryRunner: QueryRunner;

  async InTransaction<T>(
    callback: (uow: TestTypeOrmUoW) => Promise<T>,
  ): Promise<T> {
    var transactionTypeOrmUoW = new TestTypeOrmUoW(getConnection());
    let result: T;
    try {
      await transactionTypeOrmUoW.BeginTransaction();
      result = await callback(transactionTypeOrmUoW);
      await transactionTypeOrmUoW.CommitTransaction();
    } catch (err) {
      await transactionTypeOrmUoW.RollbackTransaction().catch((err) => {
        if (err instanceof Error) return Promise.reject(err.message);
        return Promise.reject(err);
      });
      if (err instanceof Error) return Promise.reject(err.message);
      return Promise.reject(err);
    }
    return result;
  }

  private async BeginTransaction(): Promise<void> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  private async CommitTransaction(): Promise<void> {
    await this.RollbackTransaction();
  }

  private async RollbackTransaction(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
  }

  get Employee(): EmployeeRepo {
    if (!this._employee)
      this._employee = new EmployeeRepo(this.queryRunner.manager);
    return this._employee;
  }

  get Hall(): HallRepo {
    if (!this._hall) this._hall = new HallRepo(this.queryRunner.manager);
    return this._hall;
  }

  get Product(): ProductRepo {
    if (!this._product)
      this._product = new ProductRepo(this.queryRunner.manager);
    return this._product;
  }

  get ProductModel(): ProductModelRepo {
    if (!this._productModel)
      this._productModel = new ProductModelRepo(this.queryRunner.manager);
    return this._productModel;
  }

  get Task(): TaskRepo {
    if (!this._task) this._task = new TaskRepo(this.queryRunner.manager);
    return this._task;
  }
}
