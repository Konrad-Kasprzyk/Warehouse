import { Test, TestingModule } from '@nestjs/testing';
import { TestTypeORMModule } from '../../Infrastructure/TypeORM/testTypeorm.module';
import { Shelf, ShelfPurposes } from '../Model/Hall/shelf';
import { Task, TaskCancelCauses, TaskStatuses } from '../Model/Task/task';
import { TaskDetails } from '../Model/Task/taskDetails';
import { Product } from '../Model/Product/product';
import { ProductModel } from '../Model/ProductModel/productModel';
import { IUnitOfWork } from '../../Application/IUnitOfWork';

describe('Task', () => {
  let module: TestingModule;
  let uow: IUnitOfWork;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule],
    }).compile();

    uow = await module.resolve<IUnitOfWork>('IUnitOfWork');
  });

  it('should be defined', () => {
    let startShelf = new Shelf(1, 'gtin', ShelfPurposes.Delivery);
    startShelf.AddProduct(
      new Product(new ProductModel('partNumber', 'brand', 'name'), 'gtin'),
    );
    let taskDetails = new TaskDetails(
      1,
      startShelf,
      new Shelf(2, 'gtin2', ShelfPurposes.Storage),
    );
    expect(new Task(taskDetails)).toBeDefined();
  });

  it('should throw error', () => {
    expect(() => new Task(null)).toThrowError();
  });

  it('should have activation, finish and cancel time set to null', async () => {
    let queuedTask = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Queued, null)
    )[0];

    expect(queuedTask.Status).toEqual(TaskStatuses.Queued);
    expect(queuedTask.ActiveTime).toBeNull();
    expect(queuedTask.CancelTime).toBeNull();
    expect(queuedTask.FinishTime).toBeNull();
  });

  it('should have activation and cancel time set', async () => {
    let cancelledTask = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Cancelled, null)
    )[0];

    expect(cancelledTask.Status).toEqual(TaskStatuses.Cancelled);
    expect(cancelledTask.ActiveTime).toBeDefined();
    expect(cancelledTask.CancelTime).toBeDefined();
    expect(cancelledTask.FinishTime).toBeNull();
  });

  it('should have activation and finish time set', async () => {
    let finishedTask = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Finished, null)
    )[0];

    expect(finishedTask.Status).toEqual(TaskStatuses.Finished);
    expect(finishedTask.ActiveTime).toBeDefined();
    expect(finishedTask.CancelTime).toBeNull();
    expect(finishedTask.FinishTime).toBeDefined();
  });

  it('should activate task', async () => {
    let queuedTask = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Queued, null)
    )[0];
    queuedTask.Activate();

    expect(queuedTask.ActiveTime).toBeDefined();
    expect(queuedTask.Status).toEqual(TaskStatuses.Active);
  });

  it('should cancel task', async () => {
    let activeTask = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Active, null)
    )[0];
    activeTask.Cancel(TaskCancelCauses.ProductsMissing);

    expect(activeTask.CancelTime).toBeDefined();
    expect(activeTask.Status).toEqual(TaskStatuses.Cancelled);
    expect(activeTask.TaskCancelCause).toEqual(
      TaskCancelCauses.ProductsMissing,
    );
  });

  it('should finish task', async () => {
    let activeTask = (
      await uow.Task.FilterTasks(null, null, TaskStatuses.Active, null)
    ).find((task) => task.TaskDetails.IsCompleted());
    activeTask.Finish();

    expect(activeTask.FinishTime).toBeDefined();
    expect(activeTask.Status).toEqual(TaskStatuses.Finished);
  });
});
