import { Injectable } from "@nestjs/common";
import { Employee, Roles } from "../Model/Employee/employee";
import { Hall } from "../Model/Hall/hall";
import { Shelf } from "../Model/Hall/shelf";
import { Product } from "../Model/Product/product";
import { Task, TaskCancelCauses, TaskStatuses } from "../Model/Task/task";

/**
 * Use this class to activate, cancel or finish tasks.
 * Updates products, shelves and tasks.
 */
@Injectable()
export class TaskManager {
  /**
   * Activate the queued task and assign it to an employee.
   * @param task Task to activate.
   * @param employee The employee to whom the task is to be assigned.
   * @returns Null when operation is successful, error message otherwise.
   */
  ActivateTask(task: Task, employee: Employee): null | string {
    if (!task) return "Task is not provided.";
    if (task.Status != TaskStatuses.Queued) return "Task doesn't have queued status.";
    if (!employee) return "Employee is not provided";
    if (employee.ActiveTask) return "Employee already has an active task.";
    try {
      task.Activate();
    } catch (error) {
      return error.message;
    }

    employee.ActiveTask = task;
    return null;
  }

  /**
   * Cancels an active task. Changes the employee's active task to null.
   * @param employee Assigned employee for the task to be cancelled.
   * @param manager Manager which cancels the task.
   * @param cancelCause Cancel cause.
   * @returns Null when operation is successful, error message otherwise.
   */
  CancelTask(employee: Employee, manager: Employee, cancelCause: TaskCancelCauses): null | string {
    if (!manager) return "Missing manager.";
    if (!employee) return "Missing employee.";
    if (!cancelCause) return "Missing task cancel cause.";
    if (manager.Role != Roles.Manager) return "Provided manager is normal employee.";
    if (!employee.ActiveTask) return "Provided employee doesn't have active task";
    if (employee.ActiveTask.Status != TaskStatuses.Active)
      return "Task to cancel doesn't have active status";
    try {
      employee.ActiveTask.Cancel(cancelCause);
    } catch (error) {
      return error.message;
    }
    if (!manager.CancelledTasks) manager.CancelledTasks = [];
    manager.CancelledTasks.push(employee.ActiveTask);
    employee.ActiveTask = null;
    return null;
  }

  /**
   * Finishes task. Makes changes to shelves and products which were included in the task.
   * Changes the employee's active task to null.
   * @param employee The employee to whom the task will finish.
   * @param hall Hall where task was occuring.
   * @param taskProducts Products placed on the destination shelf.
   * @returns Null when operation is successful, error message otherwise.
   */
  FinishTask(employee: Employee, hall: Hall, taskProducts: Product[]): null | string {
    if (!employee) return "Missing Employee.";
    if (!hall) return "Missing Hall.";
    if (!employee.ActiveTask) return "Employee has no active task to finish.";
    if (employee.ActiveTask.Status != TaskStatuses.Active)
      return "Active task of the employee has not an active status.";
    if (!employee.ActiveTask.TaskDetails.IsCompleted())
      return "Task is not completed to change his status to finished and make changes to shelves.";
    if (!taskProducts || taskProducts.length == 0)
      return "Products placed on the shelf were not provided.";
    for (const productGtin of employee.ActiveTask.TaskDetails.StoredProductsGtins) {
      if (!taskProducts.some((product) => product.Gtin == productGtin))
        return "Not all products placed on the shelf were provided.";
    }
    // Update shelves
    const startingShelf: Shelf = hall.Shelves.find(
      (s) => s.Gtin == employee.ActiveTask.TaskDetails.StartingShelfGtin
    );
    if (!startingShelf) return "Starting shelf not found";

    for (const productGtin of employee.ActiveTask.TaskDetails.StoredProductsGtins) {
      if (!startingShelf.RemoveProduct(productGtin))
        return "One of products picked up from starting shelf couldn't be removed from shelf.";
    }

    const destinationShelf: Shelf = hall.Shelves.find(
      (s) => s.Gtin == employee.ActiveTask.TaskDetails.DestinationShelfGtin
    );
    if (!destinationShelf) return "Destination shelf not found";

    for (const productGtin of employee.ActiveTask.TaskDetails.StoredProductsGtins) {
      let product: Product = taskProducts.find((p) => p.Gtin == productGtin);
      if (!product) return "One of products placed on the destination shelf couldn't be found.";
      if (!destinationShelf.AddProduct(product))
        return "One of stored products couldn't be added to destination shelf";
    }

    try {
      employee.ActiveTask.Finish();
    } catch (error) {
      return error.message;
    }
    employee.Tasks.push(employee.ActiveTask);
    employee.ActiveTask = null;
    return null;
  }
}
