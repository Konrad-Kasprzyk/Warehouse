import { ITaskRepository } from '../../../Application/Repositories/ITaskRepository';
import { TaskStatuses } from '../../../Domain/Model/Task/task';
import { EntityManager, Repository } from 'typeorm';
import { Hall } from '../Entities/Hall.entity';
import { Task } from '../Entities/Task.entity';
import { Employee } from '../Entities/Employee.entity';
import { TaskDetails } from '../Entities/TaskDetails.entity';

export class TaskRepo implements ITaskRepository {
  constructor(entityManager: EntityManager) {
    this.taskRepository = entityManager.getRepository<Task>(Task);
    this.taskDetailsRepository =
      entityManager.getRepository<TaskDetails>(TaskDetails);
  }
  private taskRepository: Repository<Task>;
  private taskDetailsRepository: Repository<TaskDetails>;

  UpdateTask(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }

  AddTask(task: Task): Promise<Task> {
    const newTask = this.taskRepository.create(task);
    return this.taskRepository.save(newTask);
  }

  async FilterTasks(
    hall: Hall,
    employee: Employee,
    status: TaskStatuses,
    activationDate: Date,
  ): Promise<Task[]> {
    let query: {
      Hall?: Hall;
      employeeActiveTask?: Employee;
      employeeFinishedTask?: Employee;
      employeeCancelledTask?: Employee;
      Status?: TaskStatuses;
    } = {};
    if (hall) query.Hall = hall;
    if (status) query.Status = status;
    let tasks: Task[];
    if (employee) {
      tasks = await this.taskRepository.find({
        where: [
          { ...query, employeeActiveTask: employee },
          { ...query, employeeFinishedTask: employee },
          { ...query, employeeCancelledTask: employee },
        ],
      });
    } else {
      tasks = await this.taskRepository.find(query);
    }
    if (activationDate) {
      const start = new Date(activationDate.getTime());
      start.setHours(1, 0, 0, 0);
      const end = new Date(activationDate.getTime());
      end.setHours(24, 59, 59, 999);
      tasks = tasks.filter(
        (task) =>
          task.ActiveTime &&
          start.getTime() <= task.ActiveTime.getTime() &&
          task.ActiveTime.getTime() <= end.getTime(),
      );
    }
    return tasks;
  }

  GetTask(id: number): Promise<Task> {
    return this.taskRepository.findOne({ id: id });
  }

  GetAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async RemoveTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ id: id });
    if (!task) return Promise.reject(`Task with id ${id} not found`);
    await this.taskDetailsRepository.remove(task.TaskDetails);
    return await this.taskRepository.remove(task);
  }
}
