import { Test, TestingModule } from '@nestjs/testing';
import { DomainModule } from '../../Domain/domain.module';
import { ShelfPurposes } from '../../Domain/Model/Hall/shelf';
import { TestTypeORMModule } from '../../Infrastructure/TypeORM/testTypeorm.module';
import { HallService } from '../Services/hall.service';
import { ProductService } from '../Services/product.service';
import { TaskService } from '../Services/task.service';
import * as _ from 'lodash';
import { EmployeeService } from '../Services/employee.service';
import { TaskCancelCauses, TaskStatuses } from '../../Domain/Model/Task/task';
import { Roles } from '../../Domain/Model/Employee/employee';

describe('TaskService', () => {
  let module: TestingModule;
  let taskService: TaskService;
  let hallService: HallService;
  let productService: ProductService;
  let employeeService: EmployeeService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule, DomainModule],
      providers: [TaskService, HallService, ProductService, EmployeeService],
    }).compile();
    taskService = await module.resolve<TaskService>(TaskService);
    hallService = await module.resolve<HallService>(HallService);
    productService = await module.resolve<ProductService>(ProductService);
    employeeService = await module.resolve<EmployeeService>(EmployeeService);
  });

  it('should get task', async () => {
    const task = await taskService.GetTask(1);

    expect(task).toBeDefined();
    expect(task.TaskDetails).toBeDefined();
  });

  it('should an array of all tasks', async () => {
    const tasks = await taskService.GetAllTasks();

    expect(tasks).toBeDefined();
    expect(tasks[0]).toBeDefined();
    expect(tasks[0].TaskDetails).toBeDefined();
    expect(tasks.length).toBeGreaterThan(1);
  });

  it('should remove task', async () => {
    const task = await taskService.RemoveTask(1);

    expect(task).toBeDefined();
  });

  it('should add task from delivery shelf to storage shelf', async () => {
    const deliveryShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Delivery,
    );
    const storageShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Storage,
    );
    const deliveryShelf = deliveryShelves.find((deliveryShelf) =>
      storageShelves.some(
        (storageShelf) =>
          storageShelf.ProductModelBrand == deliveryShelf.ProductModelBrand &&
          storageShelf.ProductModelPartNumber ==
            deliveryShelf.ProductModelPartNumber,
      ),
    );
    const storageShelf = storageShelves.find(
      (s) =>
        s.ProductModelBrand == deliveryShelf.ProductModelBrand &&
        s.ProductModelPartNumber == deliveryShelf.ProductModelPartNumber,
    );
    const task = await taskService.AddTask(
      1,
      deliveryShelf.Gtin,
      storageShelf.Gtin,
      1,
    );

    expect(task).toBeDefined();
    expect(task.TaskDetails.StartingShelfGtin).toEqual(deliveryShelf.Gtin);
    expect(task.TaskDetails.DestinationShelfGtin).toEqual(storageShelf.Gtin);
    expect(task.TaskDetails.ScansRequired).toEqual(1);
  });

  it('should add task from storage shelf to shipment shelf', async () => {
    const storageShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Storage,
    );
    const shipmentShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Shipment,
    );
    const storageShelf = storageShelves.find((storageShelf) =>
      shipmentShelves.some(
        (shipmentShelf) =>
          shipmentShelf.ProductModelBrand == storageShelf.ProductModelBrand &&
          shipmentShelf.ProductModelPartNumber ==
            storageShelf.ProductModelPartNumber,
      ),
    );
    const shipmentShelf = shipmentShelves.find(
      (s) =>
        s.ProductModelBrand == storageShelf.ProductModelBrand &&
        s.ProductModelPartNumber == storageShelf.ProductModelPartNumber,
    );
    const task = await taskService.AddTask(
      1,
      storageShelf.Gtin,
      shipmentShelf.Gtin,
      1,
    );

    expect(task).toBeDefined();
    expect(task.TaskDetails.StartingShelfGtin).toEqual(storageShelf.Gtin);
    expect(task.TaskDetails.DestinationShelfGtin).toEqual(shipmentShelf.Gtin);
    expect(task.TaskDetails.ScansRequired).toEqual(1);
  });

  it('should add task from delivery shelf to shipment shelf', async () => {
    const deliveryShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Delivery,
    );
    const shipmentShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Shipment,
    );
    const deliveryShelf = deliveryShelves.find((deliveryShelf) =>
      shipmentShelves.some(
        (shipmentShelf) =>
          shipmentShelf.ProductModelBrand == deliveryShelf.ProductModelBrand &&
          shipmentShelf.ProductModelPartNumber ==
            deliveryShelf.ProductModelPartNumber,
      ),
    );
    const shipmentShelf = shipmentShelves.find(
      (s) =>
        s.ProductModelBrand == deliveryShelf.ProductModelBrand &&
        s.ProductModelPartNumber == deliveryShelf.ProductModelPartNumber,
    );
    const task = await taskService.AddTask(
      1,
      deliveryShelf.Gtin,
      shipmentShelf.Gtin,
      1,
    );

    expect(task).toBeDefined();
    expect(task.TaskDetails.StartingShelfGtin).toEqual(deliveryShelf.Gtin);
    expect(task.TaskDetails.DestinationShelfGtin).toEqual(shipmentShelf.Gtin);
    expect(task.TaskDetails.ScansRequired).toEqual(1);
  });

  it('should add task from delivery shelf to empty shipment shelf', async () => {
    const startingShelf = (
      await hallService.FilterShelves(1, null, ShelfPurposes.Delivery)
    )[0];
    const shipmentShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Shipment,
    );
    const emptyShipmentShelf = await shipmentShelves.find(
      (shelf) => !shelf.ProductModelBrand,
    );
    const task = await taskService.AddTask(
      1,
      startingShelf.Gtin,
      emptyShipmentShelf.Gtin,
      1,
    );

    expect(task).toBeDefined();
    expect(task.TaskDetails.StartingShelfGtin).toEqual(startingShelf.Gtin);
    expect(task.TaskDetails.DestinationShelfGtin).toEqual(
      emptyShipmentShelf.Gtin,
    );
    expect(task.TaskDetails.ScansRequired).toEqual(1);
  });

  it('should add task from storage shelf to empty shipment shelf', async () => {
    const startingShelf = (
      await hallService.FilterShelves(1, null, ShelfPurposes.Storage)
    )[0];
    const shipmentShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Shipment,
    );
    const emptyShipmentShelf = await shipmentShelves.find(
      (shelf) => !shelf.ProductModelBrand,
    );
    const task = await taskService.AddTask(
      1,
      startingShelf.Gtin,
      emptyShipmentShelf.Gtin,
      1,
    );

    expect(task).toBeDefined();
    expect(task.TaskDetails.StartingShelfGtin).toEqual(startingShelf.Gtin);
    expect(task.TaskDetails.DestinationShelfGtin).toEqual(
      emptyShipmentShelf.Gtin,
    );
    expect(task.TaskDetails.ScansRequired).toEqual(1);
  });

  it('should not add task because shelves are from different hall', async () => {
    const storageShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Storage,
    );
    const shipmentShelves = await hallService.FilterShelves(
      2,
      null,
      ShelfPurposes.Shipment,
    );
    const storageShelf = storageShelves.find((storageShelf) =>
      shipmentShelves.some(
        (shipmentShelf) =>
          shipmentShelf.ProductModelBrand == storageShelf.ProductModelBrand &&
          shipmentShelf.ProductModelPartNumber ==
            storageShelf.ProductModelPartNumber,
      ),
    );
    const shipmentShelf = shipmentShelves.find(
      (s) =>
        s.ProductModelBrand == storageShelf.ProductModelBrand &&
        s.ProductModelPartNumber == storageShelf.ProductModelPartNumber,
    );

    await expect(
      taskService.AddTask(1, storageShelf.Gtin, shipmentShelf.Gtin, 1),
    ).rejects.toBeDefined();
  });

  it('should not add task because the starting shelf has different product model than the destination shelf', async () => {
    const startingShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Delivery,
    );
    const destinationShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Storage,
    );
    const startingShelf = startingShelves[0];
    const destinationShelf = destinationShelves.find(
      (s) =>
        s.ProductModelBrand &&
        s.ProductModelPartNumber &&
        s.ProductModelBrand != startingShelf.ProductModelBrand &&
        s.ProductModelPartNumber != startingShelf.ProductModelPartNumber,
    );

    await expect(
      taskService.AddTask(1, startingShelf.Gtin, destinationShelf.Gtin, 1),
    ).rejects.toBeDefined();
  });

  it('should not add task because arguments are missing', async () => {
    const deliveryShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Delivery,
    );
    const storageShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Storage,
    );
    const deliveryShelf = deliveryShelves.find((deliveryShelf) =>
      storageShelves.some(
        (storageShelf) =>
          storageShelf.ProductModelBrand == deliveryShelf.ProductModelBrand &&
          storageShelf.ProductModelPartNumber ==
            deliveryShelf.ProductModelPartNumber,
      ),
    );
    const storageShelf = storageShelves.find(
      (s) =>
        s.ProductModelBrand == deliveryShelf.ProductModelBrand &&
        s.ProductModelPartNumber == deliveryShelf.ProductModelPartNumber,
    );

    await expect(
      taskService.AddTask(null, deliveryShelf.Gtin, storageShelf.Gtin, 1),
    ).rejects.toBeDefined();
    await expect(
      taskService.AddTask(1, null, storageShelf.Gtin, 1),
    ).rejects.toBeDefined();
    await expect(
      taskService.AddTask(1, deliveryShelf.Gtin, null, 1),
    ).rejects.toBeDefined();
    await expect(
      taskService.AddTask(1, deliveryShelf.Gtin, storageShelf.Gtin, null),
    ).rejects.toBeDefined();
  });

  it('should not add task because arguments are improper', async () => {
    const deliveryShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Delivery,
    );
    const storageShelves = await hallService.FilterShelves(
      1,
      null,
      ShelfPurposes.Storage,
    );
    const deliveryShelf = deliveryShelves.find((deliveryShelf) =>
      storageShelves.some(
        (storageShelf) =>
          storageShelf.ProductModelBrand == deliveryShelf.ProductModelBrand &&
          storageShelf.ProductModelPartNumber ==
            deliveryShelf.ProductModelPartNumber,
      ),
    );
    const storageShelf = storageShelves.find(
      (s) =>
        s.ProductModelBrand == deliveryShelf.ProductModelBrand &&
        s.ProductModelPartNumber == deliveryShelf.ProductModelPartNumber,
    );

    await expect(
      taskService.AddTask(-42, deliveryShelf.Gtin, storageShelf.Gtin, 1),
    ).rejects.toBeDefined();
    await expect(
      taskService.AddTask(1, 'wrong GTIN', storageShelf.Gtin, 1),
    ).rejects.toBeDefined();
    await expect(
      taskService.AddTask(1, deliveryShelf.Gtin, 'wrong GTIN', 1),
    ).rejects.toBeDefined();
    await expect(
      taskService.AddTask(1, deliveryShelf.Gtin, storageShelf.Gtin, -42),
    ).rejects.toBeDefined();
  });

  it('should return an array of all tasks from one hall', async () => {
    const hall = await hallService.GetHall(1);
    const tasks = await taskService.FilterTasks(1, null, null, null);

    hall.Tasks.forEach((task) =>
      expect(tasks.some((t) => _.isEqual(t, task))).toBeTruthy(),
    );
  });

  it('should return an array of all tasks assigned to one employee', async () => {
    const employee = await employeeService.GetEmployee(1);
    const tasks = await taskService.FilterTasks(null, 1, null, null);

    employee.Tasks.forEach((task) =>
      expect(tasks.some((t) => _.isEqual(t, task))).toBeTruthy(),
    );
  });

  it('should return an array of all tasks with one task status', async () => {
    const tasks = await taskService.FilterTasks(
      null,
      null,
      TaskStatuses.Queued,
      null,
    );

    expect(tasks).toBeDefined();
    expect(tasks.length).toBeGreaterThan(1);
    tasks.forEach((task) =>
      expect(task.Status == TaskStatuses.Queued).toBeTruthy(),
    );
  });

  it('should return an array of all tasks activated on the same day', async () => {
    const activationDate = new Date(2022, 0, 25, 1);
    const tasks = await taskService.FilterTasks(
      null,
      null,
      null,
      activationDate,
    );

    expect(tasks).toBeDefined();
    expect(tasks.length).toBeGreaterThan(1);
    tasks.forEach((task) => {
      task.ActiveTime.setHours(1, 0, 0, 0);
      expect(
        task.ActiveTime.getTime() == activationDate.getTime(),
      ).toBeTruthy();
    });
  });

  it('should return an array of all cancelled tasks by a manager', async () => {
    const manager = (
      await employeeService.FilterEmployees(Roles.Manager, null)
    ).find((manager) => manager.CancelledTasks?.length > 0);
    const tasks = await taskService.FilterTasks(
      null,
      manager.id,
      TaskStatuses.Cancelled,
      null,
    );

    expect(tasks).toBeDefined();
    expect(tasks.length).toBeGreaterThan(0);
    tasks.forEach((task) =>
      expect(task.Status == TaskStatuses.Cancelled).toBeTruthy(),
    );
  });

  it('should accept product scan', async () => {
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Active, null)
    ).find(
      (task) =>
        !task.TaskDetails.IsCompleted() &&
        task.TaskDetails.PickedUpProductsGtins?.length > 0 &&
        task.TaskDetails.ScannedShelfGtin ==
          task.TaskDetails.DestinationShelfGtin,
    );
    const scannedProductGtin = task.TaskDetails.PickedUpProductsGtins[0];
    task = await taskService.ScanProduct(task.id, scannedProductGtin);

    expect(task).toBeDefined();
    expect(task.TaskDetails.StoredProductsGtins).toContain(scannedProductGtin);
  });

  it('should not accept product scan, because proper shelf was not scanned.', async () => {
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Active, null)
    ).find(
      (task) =>
        !task.TaskDetails.IsCompleted() &&
        task.TaskDetails.PickedUpProductsGtins?.length > 0 &&
        task.TaskDetails.ScannedShelfGtin !=
          task.TaskDetails.DestinationShelfGtin,
    );
    const scannedProductGtin = task.TaskDetails.PickedUpProductsGtins[0];

    await expect(
      taskService.ScanProduct(task.id, scannedProductGtin),
    ).rejects.toBeDefined();
  });

  it('should not accept product scan, because product has an improper product model', async () => {
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Active, null)
    ).find(
      (task) =>
        !task.TaskDetails.IsCompleted() &&
        task.TaskDetails.PickedUpProductsGtins?.length > 0 &&
        task.TaskDetails.ScannedShelfGtin ==
          task.TaskDetails.DestinationShelfGtin,
    );
    const products = await productService.GetAllProducts();
    const product = products.find(
      (product) =>
        product.ProductModel.Brand != task.TaskDetails.ProductModelBrand &&
        product.ProductModel.PartNumber !=
          task.TaskDetails.ProductModelPartNumber,
    );

    await expect(
      taskService.ScanProduct(task.id, product.Gtin),
    ).rejects.toBeDefined();
  });

  it('should not accept product scan, because task is not activated', async () => {
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Queued, null)
    )[0];
    const products = await productService.GetAllProducts();
    const product = products.find(
      (product) =>
        product.ProductModel.Brand != task.TaskDetails.ProductModelBrand &&
        product.ProductModel.PartNumber !=
          task.TaskDetails.ProductModelPartNumber,
    );

    await expect(
      taskService.ScanProduct(task.id, product.Gtin),
    ).rejects.toBeDefined();
  });

  it('should accept shelf scan', async () => {
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Active, null)
    ).find(
      (task) =>
        task.TaskDetails.ScannedShelfGtin !=
        task.TaskDetails.DestinationShelfGtin,
    );
    task = await taskService.ScanShelf(
      task.id,
      task.TaskDetails.DestinationShelfGtin,
    );

    expect(task).toBeDefined();
    expect(task.TaskDetails.ScannedShelfGtin).toEqual(
      task.TaskDetails.DestinationShelfGtin,
    );
  });

  it('should not accept shelf scan, because shelf has an improper product model.', async () => {
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Active, null)
    )[0];
    const shelf = (await hallService.GetAllShelves()).find(
      (shelf) =>
        shelf.ProductModelBrand &&
        shelf.ProductModelPartNumber &&
        shelf.ProductModelBrand != task.TaskDetails.ProductModelBrand &&
        shelf.ProductModelPartNumber != task.TaskDetails.ProductModelPartNumber,
    );

    await expect(
      taskService.ScanShelf(task.id, shelf.Gtin),
    ).rejects.toBeDefined();
  });

  it('should not accept shelf scan, because task is not activated', async () => {
    const task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Queued, null)
    )[0];

    await expect(
      taskService.ScanShelf(task.id, task.TaskDetails.StartingShelfGtin),
    ).rejects.toBeDefined();
  });

  it('should activate task', async () => {
    const employee = (await employeeService.GetAllEmployees()).find(
      (employee) => !employee.ActiveTask,
    );
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Queued, null)
    )[0];
    task = await taskService.ActivateTask(task.id, employee.id);

    expect(task).toBeDefined();
    expect(task.Status).toBe(TaskStatuses.Active);
    expect(task.ActiveTime).toBeDefined();
  });

  it('should not activate task, because task is already activated', async () => {
    const employee = (await employeeService.GetAllEmployees()).find(
      (employee) => !employee.ActiveTask,
    );
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Active, null)
    )[0];

    await expect(
      taskService.ActivateTask(task.id, employee.id),
    ).rejects.toBeDefined();
  });

  it('should not activate task, because task is finished', async () => {
    const employee = (await employeeService.GetAllEmployees()).find(
      (employee) => !employee.ActiveTask,
    );
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Finished, null)
    )[0];

    await expect(
      taskService.ActivateTask(task.id, employee.id),
    ).rejects.toBeDefined();
  });

  it('should not activate task, because employee already has an active task', async () => {
    const employee = (await employeeService.GetAllEmployees()).find(
      (employee) => employee.ActiveTask,
    );
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Queued, null)
    )[0];

    await expect(
      taskService.ActivateTask(task.id, employee.id),
    ).rejects.toBeDefined();
  });

  it('should not activate task, because arguments are improper', async () => {
    const employee = (await employeeService.GetAllEmployees()).find(
      (employee) => !employee.ActiveTask,
    );
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Queued, null)
    )[0];

    await expect(
      taskService.ActivateTask(-42, employee.id),
    ).rejects.toBeDefined();
    await expect(taskService.ActivateTask(task.id, -42)).rejects.toBeDefined();
  });

  it('should not activate task, because arguments are missing', async () => {
    const employee = (await employeeService.GetAllEmployees()).find(
      (employee) => !employee.ActiveTask,
    );
    let task = (
      await taskService.FilterTasks(null, null, TaskStatuses.Queued, null)
    )[0];

    await expect(
      taskService.ActivateTask(null, employee.id),
    ).rejects.toBeDefined();
    await expect(taskService.ActivateTask(task.id, null)).rejects.toBeDefined();
  });

  it('should finish task', async () => {
    const hall = await hallService.GetHall(1);
    const employee = hall.Employees.find((employee) =>
      employee.ActiveTask?.TaskDetails.IsCompleted(),
    );
    const task = await taskService.FinishTask(employee.id, hall.Number);

    expect(task).toBeDefined();
    expect(task.Status).toBe(TaskStatuses.Finished);
    expect(task.FinishTime).toBeDefined();
  });

  it('should not finish task, because task is not completed', async () => {
    const hall = await hallService.GetHall(1);
    const employee = hall.Employees.find(
      (employee) => !employee.ActiveTask?.TaskDetails.IsCompleted(),
    );

    await expect(
      taskService.FinishTask(employee.id, hall.Number),
    ).rejects.toBeDefined();
  });

  it('should not finish task, because hall is improper', async () => {
    const hall = await hallService.GetHall(1);
    const employee = hall.Employees.find((employee) =>
      employee.ActiveTask?.TaskDetails.IsCompleted(),
    );

    await expect(taskService.FinishTask(employee.id, 2)).rejects.toBeDefined();
  });

  it("should not finish task, because employee doesn't have an active task", async () => {
    const hall = await hallService.GetHall(2);
    const employee = hall.Employees.find((employee) => !employee.ActiveTask);

    await expect(
      taskService.FinishTask(employee.id, hall.Number),
    ).rejects.toBeDefined();
  });

  it('should not finish task, because arguments are improper', async () => {
    const hall = await hallService.GetHall(1);
    const employee = hall.Employees.find((employee) =>
      employee.ActiveTask?.TaskDetails.IsCompleted(),
    );

    await expect(
      taskService.FinishTask(-42, hall.Number),
    ).rejects.toBeDefined();
    await expect(
      taskService.FinishTask(employee.id, -42),
    ).rejects.toBeDefined();
  });

  it('should not finish task, because arguments are missing', async () => {
    const hall = await hallService.GetHall(1);
    const employee = hall.Employees.find((employee) =>
      employee.ActiveTask?.TaskDetails.IsCompleted(),
    );

    await expect(
      taskService.FinishTask(null, hall.Number),
    ).rejects.toBeDefined();
    await expect(
      taskService.FinishTask(employee.id, null),
    ).rejects.toBeDefined();
  });

  it('should cancel task', async () => {
    const employees = await employeeService.FilterEmployees(Roles.Employee, 1);
    const managers = await employeeService.FilterEmployees(Roles.Manager, 1);
    const employee = employees.find((employee) => employee.ActiveTask);
    const task = await taskService.CancelTask(
      employee.id,
      managers[0].id,
      TaskCancelCauses.LackOfSpace,
    );

    expect(task).toBeDefined();
    expect(task.Status).toBe(TaskStatuses.Cancelled);
    expect(task.CancelTime).toBeDefined();
  });

  it("should not cancel task, because employee doesn't have an active task", async () => {
    const employees = await employeeService.FilterEmployees(Roles.Employee, 2);
    const managers = await employeeService.FilterEmployees(Roles.Manager, 2);
    const employee = employees.find((employee) => !employee.ActiveTask);

    await expect(
      taskService.CancelTask(
        employee.id,
        managers[0].id,
        TaskCancelCauses.LackOfSpace,
      ),
    ).rejects.toBeDefined();
  });

  it('should not cancel task, because normal employee tries to cancel task', async () => {
    const employees = await employeeService.FilterEmployees(Roles.Employee, 1);
    const firstEmployee = employees.find((employee) => employee.ActiveTask);
    const secondEmployee = employees.find(
      (employee) => employee.Name != firstEmployee.Name,
    );

    await expect(
      taskService.CancelTask(
        firstEmployee.id,
        secondEmployee.id,
        TaskCancelCauses.LackOfSpace,
      ),
    ).rejects.toBeDefined();
  });

  it('should not cancel task, because arguments are improper', async () => {
    const employees = await employeeService.FilterEmployees(Roles.Employee, 1);
    const managers = await employeeService.FilterEmployees(Roles.Manager, 1);
    const employee = employees.find((employee) => employee.ActiveTask);

    await expect(
      taskService.CancelTask(-42, managers[0].id, TaskCancelCauses.LackOfSpace),
    ).rejects.toBeDefined();
    await expect(
      taskService.CancelTask(employee.id, -42, TaskCancelCauses.LackOfSpace),
    ).rejects.toBeDefined();
    await expect(
      taskService.CancelTask(
        employee.id,
        managers[0].id,
        'wrong task cancel cause',
      ),
    ).rejects.toBeDefined();
  });

  it('should not cancel task, because arguments are missing', async () => {
    const employees = await employeeService.FilterEmployees(Roles.Employee, 1);
    const managers = await employeeService.FilterEmployees(Roles.Manager, 1);
    const employee = employees.find((employee) => employee.ActiveTask);

    await expect(
      taskService.CancelTask(
        null,
        managers[0].id,
        TaskCancelCauses.LackOfSpace,
      ),
    ).rejects.toBeDefined();
    await expect(
      taskService.CancelTask(employee.id, null, TaskCancelCauses.LackOfSpace),
    ).rejects.toBeDefined();
    await expect(
      taskService.CancelTask(employee.id, managers[0].id, null),
    ).rejects.toBeDefined();
  });
});
