import { Task } from "../Task/task";

export enum Roles {
  Employee = "Employee",
  Manager = "Manager",
}
/** Store information about single employee, his current task and history of tasks. */
export class Employee {
  /**
   * @throws Name or surname is missing.
   */
  constructor(name: string, surname: string, role: Roles) {
    if (!name) throw new Error("Employee name is null or empty.");
    if (!surname) throw new Error("Employee surname is null or empty.");
    if (!role) throw new Error("Missing employee role.");

    this.Name = name;
    this.Surname = surname;
    this.Role = role;
  }
  readonly id: number;
  readonly Name: string;
  readonly Surname: string;
  /** Manager or normal employee. */
  readonly Role: Roles;
  /** Current task, can be null. When finished or cancelled then pushed into Tasks (history). */
  ActiveTask: Task;
  /** List of this employee's past tasks */
  Tasks: Task[];
  /** List of tasks canceled by this employee. Employee must be a manager to cancel tasks. */
  CancelledTasks: Task[];
}
