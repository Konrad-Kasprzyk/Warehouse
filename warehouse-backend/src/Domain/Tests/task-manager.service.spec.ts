import { Test, TestingModule } from '@nestjs/testing';
import { IUnitOfWork } from '../../Application/IUnitOfWork';
import { TestTypeORMModule } from '../../Infrastructure/TypeORM/testTypeorm.module';
import { Roles } from '../Model/Employee/employee';
import { TaskCancelCauses, TaskStatuses } from '../Model/Task/task';
import { TaskManager } from '../Service/task-manager.service';
import * as _ from 'lodash';

describe('TaskManager', () => {
  let module: TestingModule;
  let uow: IUnitOfWork;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule],
    }).compile();

    uow = await module.resolve<IUnitOfWork>('IUnitOfWork');
  });

  it('should be defined', () => {
    expect(new TaskManager()).toBeDefined();
  });

  it('should activate task', async () => {
    const queuedTasks = await uow.Task.FilterTasks(
      null,
      null,
      TaskStatuses.Queued,
      null,
    );
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const task = queuedTasks[0];
    const employee = employees.find((employee) => !employee.ActiveTask);
    const errorMessage = taskManager.ActivateTask(task, employee);

    expect(errorMessage).toBeNull();
    expect(employee.ActiveTask).toBe(task);
    expect(task.Status).toBe(TaskStatuses.Active);
    expect(task.ActiveTime).toBeDefined();
  });

  it('should not activate task because task is already activated', async () => {
    const activeTasks = await uow.Task.FilterTasks(
      null,
      null,
      TaskStatuses.Active,
      null,
    );
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const task = activeTasks[0];
    const employee = employees.find((employee) => !employee.ActiveTask);
    const errorMessage = taskManager.ActivateTask(task, employee);

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBeNull();
  });

  it('should not activate task because employee already has an active task', async () => {
    const queuedTasks = await uow.Task.FilterTasks(
      null,
      null,
      TaskStatuses.Queued,
      null,
    );
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const task = queuedTasks[0];
    const employee = employees.find((employee) => employee.ActiveTask);
    const errorMessage = taskManager.ActivateTask(task, employee);

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBeDefined();
    expect(task.Status).toBe(TaskStatuses.Queued);
    expect(task.ActiveTime).toBeNull();
  });

  it('should not activate task because employee is missing', async () => {
    const queuedTasks = await uow.Task.FilterTasks(
      null,
      null,
      TaskStatuses.Queued,
      null,
    );
    const taskManager = new TaskManager();
    const task = queuedTasks[0];
    const errorMessage = taskManager.ActivateTask(task, null);

    expect(errorMessage).not.toBeNull();
    expect(task.Status).toBe(TaskStatuses.Queued);
    expect(task.ActiveTime).toBeNull();
  });

  it('should not activate task because task is missing', async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const employee = employees.find((employee) => !employee.ActiveTask);
    const errorMessage = taskManager.ActivateTask(null, employee);

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBeNull();
  });

  it('should cancel task', async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) => employee.ActiveTask && employee.Role == Roles.Employee,
    );
    const task = employee.ActiveTask;
    const manager = employees.find(
      (employee) => employee.Role == Roles.Manager,
    );
    const errorMessage = taskManager.CancelTask(
      employee,
      manager,
      TaskCancelCauses.LackOfSpace,
    );

    expect(errorMessage).toBeNull();
    expect(employee.ActiveTask).toBeNull();
    expect(task.Status).toBe(TaskStatuses.Cancelled);
    expect(task.CancelTime).toBeDefined();
    expect(task.TaskCancelCause).toBe(TaskCancelCauses.LackOfSpace);
    expect(manager.CancelledTasks).toContain(task);
  });

  it('should not cancel task because task is not active', async () => {
    const queuedTasks = await uow.Task.FilterTasks(
      null,
      null,
      TaskStatuses.Queued,
      null,
    );
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) => employee.Role == Roles.Employee,
    );
    const task = queuedTasks[0];
    employee.ActiveTask = task;
    const manager = employees.find(
      (employee) => employee.Role == Roles.Manager,
    );
    const errorMessage = taskManager.CancelTask(
      employee,
      manager,
      TaskCancelCauses.LackOfSpace,
    );

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBe(task);
    expect(task.Status).toBe(TaskStatuses.Queued);
    expect(task.CancelTime).toBeNull();
    expect(task.TaskCancelCause).toBeNull();
    expect(manager.CancelledTasks).not.toContain(task);
  });

  it('should not cancel task because task is not cancelled by a manager', async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const employee = employees.find((employee) => employee.ActiveTask);
    const task = employee.ActiveTask;
    const manager = employees.find(
      (employee) => employee.Role == Roles.Employee,
    );
    const errorMessage = taskManager.CancelTask(
      employee,
      manager,
      TaskCancelCauses.LackOfSpace,
    );

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBe(task);
    expect(task.Status).toBe(TaskStatuses.Active);
    expect(task.CancelTime).toBeNull();
    expect(task.TaskCancelCause).toBeNull();
    expect(manager.CancelledTasks).not.toContain(task);
  });

  it("should not cancel task because employee doesn't have an active task", async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) => !employee.ActiveTask && employee.Role == Roles.Employee,
    );
    const manager = employees.find(
      (employee) => employee.Role == Roles.Manager,
    );
    const errorMessage = taskManager.CancelTask(
      employee,
      manager,
      TaskCancelCauses.LackOfSpace,
    );

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBeNull();
  });

  it('should not cancel task because arguments are missing', async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) => employee.ActiveTask && employee.Role == Roles.Employee,
    );
    const task = employee.ActiveTask;
    const manager = employees.find(
      (employee) => employee.Role == Roles.Manager,
    );

    expect(
      taskManager.CancelTask(null, manager, TaskCancelCauses.LackOfSpace),
    ).not.toBeNull();
    expect(
      taskManager.CancelTask(employee, null, TaskCancelCauses.LackOfSpace),
    ).not.toBeNull();
    expect(taskManager.CancelTask(employee, manager, null)).not.toBeNull();
    expect(employee.ActiveTask).toBe(task);
    expect(task.Status).toBe(TaskStatuses.Active);
    expect(task.CancelTime).toBeNull();
    expect(task.TaskCancelCause).toBeNull();
    expect(manager.CancelledTasks).not.toContain(task);
  });

  it('should finish task', async () => {
    const halls = await uow.Hall.GetAllHalls();
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) =>
        employee.ActiveTask && employee.ActiveTask.TaskDetails.IsCompleted(),
    );
    const task = employee.ActiveTask;
    const hall = halls.find((hall) =>
      hall.Tasks.some((t) => _.isEqual(t, task)),
    );
    const startingShelf = hall.Shelves.find(
      (shelf) => shelf.Gtin == task.TaskDetails.StartingShelfGtin,
    );
    const destinationShelf = hall.Shelves.find(
      (shelf) => shelf.Gtin == task.TaskDetails.DestinationShelfGtin,
    );
    const products = await uow.Product.FilterProducts(
      hall,
      null,
      null,
      task.TaskDetails.StoredProductsGtins,
    );
    const errorMessage = taskManager.FinishTask(employee, hall, products);

    expect(errorMessage).toBeNull();
    expect(employee.ActiveTask).toBeNull();
    expect(task.Status).toBe(TaskStatuses.Finished);
    expect(task.FinishTime).toBeDefined();
    products.forEach((product) => {
      expect(startingShelf.ProductGtins).not.toContain(product.Gtin);
      expect(destinationShelf.ProductGtins).toContain(product.Gtin);
    });
  });

  it('should not finish task, because task is not completed', async () => {
    const halls = await uow.Hall.GetAllHalls();
    const employees = await uow.Employee.GetAllEmployees();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) =>
        employee.ActiveTask && !employee.ActiveTask.TaskDetails.IsCompleted(),
    );
    const task = employee.ActiveTask;
    const hall = halls.find((hall) =>
      hall.Tasks.some((t) => _.isEqual(t, task)),
    );
    const products = await uow.Product.GetAllProducts();
    const errorMessage = taskManager.FinishTask(employee, hall, products);

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBe(task);
    expect(task.Status).toBe(TaskStatuses.Active);
    expect(task.FinishTime).toBeNull();
  });

  it("should not finish task, because employee doesn't have an active task", async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const halls = await uow.Hall.GetAllHalls();
    const taskManager = new TaskManager();
    const employee = employees.find((employee) => !employee.ActiveTask);
    const hall = halls.find((hall) =>
      hall.Employees.some((e) => _.isEqual(e, employee)),
    );
    const errorMessage = taskManager.FinishTask(
      employee,
      hall,
      await uow.Product.GetAllProducts(),
    );

    expect(errorMessage).not.toBeNull();
  });

  it('should not finish task, because hall is improper', async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const halls = await uow.Hall.GetAllHalls();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) =>
        employee.ActiveTask && employee.ActiveTask.TaskDetails.IsCompleted(),
    );
    const task = employee.ActiveTask;
    const hall = halls.find((hall) =>
      hall.Tasks.every((t) => !_.isEqual(t, task)),
    );
    const products = await uow.Product.FilterProducts(
      null,
      null,
      null,
      task.TaskDetails.StoredProductsGtins,
    );
    const errorMessage = taskManager.FinishTask(employee, hall, products);

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBe(task);
    expect(task.Status).toBe(TaskStatuses.Active);
    expect(task.FinishTime).toBeNull();
  });

  it('should not finish task, because the task manager did not receive all products from task', async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const halls = await uow.Hall.GetAllHalls();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) =>
        employee.ActiveTask && employee.ActiveTask.TaskDetails.IsCompleted(),
    );
    const task = employee.ActiveTask;
    const hall = halls.find((hall) =>
      hall.Tasks.some((t) => _.isEqual(t, task)),
    );
    const products = await uow.Product.FilterProducts(
      hall,
      null,
      null,
      task.TaskDetails.StoredProductsGtins,
    );
    const errorMessage = taskManager.FinishTask(
      employee,
      hall,
      products.splice(0, 1),
    );

    expect(errorMessage).not.toBeNull();
    expect(employee.ActiveTask).toBe(task);
    expect(task.Status).toBe(TaskStatuses.Active);
    expect(task.FinishTime).toBeNull();
  });

  it('should not finish task, because arguments are missing', async () => {
    const employees = await uow.Employee.GetAllEmployees();
    const halls = await uow.Hall.GetAllHalls();
    const taskManager = new TaskManager();
    const employee = employees.find(
      (employee) =>
        employee.ActiveTask && employee.ActiveTask.TaskDetails.IsCompleted(),
    );
    const task = employee.ActiveTask;
    const hall = halls.find((hall) =>
      hall.Tasks.some((t) => _.isEqual(t, task)),
    );
    const products = await uow.Product.FilterProducts(
      hall,
      null,
      null,
      task.TaskDetails.StoredProductsGtins,
    );

    expect(taskManager.FinishTask(null, hall, products)).not.toBeNull();
    expect(taskManager.FinishTask(employee, null, products)).not.toBeNull();
    expect(taskManager.FinishTask(employee, hall, null)).not.toBeNull();
    expect(employee.ActiveTask).toBe(task);
    expect(task.Status).toBe(TaskStatuses.Active);
    expect(task.FinishTime).toBeNull();
  });
});
