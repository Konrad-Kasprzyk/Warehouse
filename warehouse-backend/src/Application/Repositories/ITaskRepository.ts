import { Employee } from "../../Domain/Model/Employee/employee";
import { Hall } from "../../Domain/Model/Hall/hall";
import { Task, TaskStatuses } from "../../Domain/Model/Task/task";

export interface ITaskRepository {
  AddTask(task: Task): Promise<Task>;

  UpdateTask(task: Task): Promise<Task>;

  FilterTasks(
    hall: Hall,
    employee: Employee,
    status: TaskStatuses,
    activationDate: Date
  ): Promise<Task[]>;

  GetTask(id: number): Promise<Task>;

  GetAllTasks(): Promise<Task[]>;

  RemoveTask(id: number): Promise<Task>;
}
