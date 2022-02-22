import { Inject, Injectable } from "@nestjs/common";
import { Employee } from "../../Domain/Model/Employee/employee";
import { Hall } from "../../Domain/Model/Hall/hall";
import { Task, TaskCancelCauses, TaskStatuses } from "../../Domain/Model/Task/task";
import { TaskDetails } from "../../Domain/Model/Task/taskDetails";
import { TaskManager } from "../../Domain/Service/task-manager.service";
import { IUnitOfWork } from "../IUnitOfWork";

@Injectable()
export class TaskService {
  constructor(
    @Inject("IUnitOfWork") private readonly uow: IUnitOfWork,
    private readonly taskManager: TaskManager
  ) {}

  AddTask(
    hallNumber: number,
    startingShelfGtin: string,
    destinationShelfGtin: string,
    scansRequired: number
  ): Promise<Task> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const hall = await uow.Hall.GetHall(hallNumber);
      if (!hall) return Promise.reject(`Hall with number ${hallNumber} not found`);
      const startingShelf = hall.Shelves.find((shelf) => shelf.Gtin == startingShelfGtin);
      if (!startingShelf)
        return Promise.reject(
          `Shelf with GTIN ${startingShelfGtin} not found in hall with number ${hallNumber}`
        );
      const destinationShelf = hall.Shelves.find((shelf) => shelf.Gtin == destinationShelfGtin);
      if (!destinationShelf)
        return Promise.reject(
          `Shelf with GTIN ${destinationShelfGtin} not found in hall with number ${hallNumber}`
        );

      const taskDetails = new TaskDetails(scansRequired, startingShelf, destinationShelf);
      const task = await uow.Task.AddTask(new Task(taskDetails));
      hall.Tasks.push(task);
      await uow.Hall.UpdateHall(hall);
      return task;
    });
  }

  async FilterTasks(
    hallNumber: number,
    employeeId: number,
    taskStatus: string,
    activationDate: Date
  ): Promise<Task[]> {
    let hall: Hall = null;
    let employee: Employee = null;
    let castedTaskStatus: TaskStatuses = null;
    if (hallNumber) {
      hall = await this.uow.Hall.GetHall(hallNumber);
      if (!hall) return Promise.reject(`Hall with number ${hallNumber} not found`);
    }
    if (employeeId) {
      employee = await this.uow.Employee.GetEmployee(employeeId);
      if (!employee) return Promise.reject(`Employee with id ${employeeId} not found`);
    }
    if (taskStatus) {
      castedTaskStatus = TaskStatuses[taskStatus];
      if (!castedTaskStatus) return Promise.reject("Invalid task status");
    }
    return this.uow.Task.FilterTasks(hall, employee, castedTaskStatus, activationDate);
  }

  GetTask(id: number): Promise<Task> {
    return this.uow.Task.GetTask(id);
  }

  GetAllTasks(): Promise<Task[]> {
    return this.uow.Task.GetAllTasks();
  }

  ScanProduct(taskId: number, productGtin: string): Promise<Task> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const task = await uow.Task.GetTask(taskId);
      if (!task) return Promise.reject(`Task with id ${taskId} not found`);
      const product = await uow.Product.GetProduct(productGtin);
      if (!product) return Promise.reject(`Product with GTIN ${productGtin} not found`);
      if (!task.ScanProduct(product)) return Promise.reject(`Product scan rejected`);
      return uow.Task.UpdateTask(task);
    });
  }

  ScanShelf(taskId: number, shelfGtin: string): Promise<Task> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const task = await uow.Task.GetTask(taskId);
      if (!task) return Promise.reject(`Task with id ${taskId} not found`);
      const shelf = await uow.Hall.GetShelf(shelfGtin);
      if (!shelf) return Promise.reject(`Shelf with GTIN ${shelfGtin} not found`);
      if (!task.ScanShelf(shelf)) return Promise.reject(`Shelf scan rejected`);
      return uow.Task.UpdateTask(task);
    });
  }

  ActivateTask(taskId: number, assignedEmployeeId: number): Promise<Task> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const task = await uow.Task.GetTask(taskId);
      if (!task) return Promise.reject(`Task with id ${taskId} not found`);
      const employee = await uow.Employee.GetEmployee(assignedEmployeeId);
      if (!employee) return Promise.reject(`Employee with id ${assignedEmployeeId} not found`);
      const errorMessage = this.taskManager.ActivateTask(task, employee);
      if (errorMessage) return Promise.reject(errorMessage);
      await uow.Employee.UpdateEmployee(employee);
      return uow.Task.UpdateTask(task);
    });
  }

  FinishTask(employeeId: number, hallNumber: number): Promise<Task> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const employee = await uow.Employee.GetEmployee(employeeId);
      if (!employee) return Promise.reject(`Employee with id ${employeeId} not found`);
      const hall = await uow.Hall.GetHall(hallNumber);
      if (!hall) return Promise.reject(`Hall with number ${hallNumber} not found`);
      const taskProducts = await uow.Product.FilterProducts(
        hall,
        null,
        null,
        employee.ActiveTask.TaskDetails.StoredProductsGtins
      );
      const finishedTask = employee.ActiveTask;
      const errorMessage = this.taskManager.FinishTask(employee, hall, taskProducts);
      if (errorMessage) return Promise.reject(errorMessage);
      await uow.Employee.UpdateEmployee(employee);
      await uow.Hall.UpdateHall(hall);
      return uow.Task.UpdateTask(finishedTask);
    });
  }

  RemoveTask(taskId: number): Promise<Task> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      return await uow.Task.RemoveTask(taskId);
    });
  }

  CancelTask(employeeId: number, managerId: number, taskCancelCause: string): Promise<Task> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const employee = await uow.Employee.GetEmployee(employeeId);
      if (!employee) return Promise.reject(`Employee with id ${employeeId} not found`);
      const manager = await uow.Employee.GetEmployee(managerId);
      if (!manager) return Promise.reject(`Manager with id ${managerId} not found`);
      const castedTaskCancelCause = TaskCancelCauses[taskCancelCause];
      if (!castedTaskCancelCause) return Promise.reject("Invalid task cancel cause");
      const cancelledTask = employee.ActiveTask;
      const errorMessage = this.taskManager.CancelTask(employee, manager, castedTaskCancelCause);
      if (errorMessage) return Promise.reject(errorMessage);
      if (manager.id == employee.id) {
        employee.CancelledTasks = manager.CancelledTasks;
        await uow.Employee.UpdateEmployee(employee);
        return uow.Task.UpdateTask(cancelledTask);
      }
      await uow.Employee.UpdateEmployee(employee);
      await uow.Employee.UpdateEmployee(manager);
      return uow.Task.UpdateTask(cancelledTask);
    });
  }
}
