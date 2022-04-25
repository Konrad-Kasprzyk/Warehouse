import { Shelf } from '../Hall/shelf';
import { Product } from '../Product/product';
import { TaskDetails } from './taskDetails';

export enum TaskStatuses {
  Queued = 'Queued',
  Active = 'Active',
  Cancelled = 'Cancelled',
  Finished = 'Finished',
}

export enum TaskCancelCauses {
  LackOfSpace = 'LackOfSpace',
  ProductsMissing = 'ProductsMissing',
  Other = 'Other',
}

/** Store single task information like assigned employee, task status and status change timestamps.
 * Has methods to manage task products scans.
 */
export class Task {
  /**
   *  @throws Task is missing task details.
   */
  constructor(taskDetails: TaskDetails) {
    if (!taskDetails) throw new Error('Task is missing task details.');
    this.TaskDetails = taskDetails;
    this.Status = TaskStatuses.Queued;
    this.QueueTime = new Date();
  }
  readonly id: number;
  readonly TaskDetails: TaskDetails;
  /** Only task with active status can handle products and shelves scans. */
  Status: TaskStatuses;
  /** Task creation time. */
  QueueTime: Date;
  /** When task became active for assigned employee. */
  ActiveTime: Date;
  /** When task was cancelled by manager. */
  CancelTime: Date;
  TaskCancelCause: TaskCancelCauses;
  /** Task completion time. Can occur only after active status. */
  FinishTime: Date;

  /** Make this task active. This allows scanning products and shelves.
   * @throws Task is not queued.
   */
  Activate(): void {
    if (this.Status != TaskStatuses.Queued)
      throw new Error('To activate task, the task must have queued status.');
    this.ActiveTime = new Date();
    this.Status = TaskStatuses.Active;
  }

  /** Cancel this task.
   * @throws Task is not active.
   */
  Cancel(cancelCause: TaskCancelCauses): void {
    if (this.Status != TaskStatuses.Active)
      throw new Error('To cancel task, the task must have active status.');
    this.CancelTime = new Date();
    this.Status = TaskStatuses.Cancelled;
    this.TaskCancelCause = cancelCause;
  }

  /** Changes status of the task to finished when all required scans were made.
   * @throws Task is not active. Not all required scans were performed in the task.
   */
  Finish(): void {
    if (this.Status != TaskStatuses.Active)
      throw new Error('To finish task, the task must have active status.');
    if (this.TaskDetails.IsCompleted() == false)
      throw new Error('Not all required scans were performed in the task.');
    this.FinishTime = new Date();
    this.Status = TaskStatuses.Finished;
  }

  /**
   * Scan shelves to allow progress with the task.
   * @param shelf Scanned shelf.
   * @returns True when scan is accepted, false otherwise.
   * @throws Task is not active.
   */
  ScanShelf(shelf: Shelf): boolean {
    if (this.Status != TaskStatuses.Active)
      throw new Error(
        'Task is not in active state, but shelf scan was requested.',
      );
    return this.TaskDetails.ScanShelf(shelf);
  }

  /**
   * Scan products to make progress in the task.
   * @param product Scanned product.
   * @returns True when scan is accepted, false otherwise.
   * @throws Task is not active.
   */
  ScanProduct(product: Product): boolean {
    if (this.Status != TaskStatuses.Active)
      throw new Error(
        'Task is not in active state, but product scan was requested.',
      );
    return this.TaskDetails.ScanProduct(product);
  }
}
