import {
  TaskCancelCauses,
  TaskStatuses,
} from '../../../Domain/Model/Task/task';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './Employee.entity';
import { TaskDetails } from './TaskDetails.entity';
import { Task as DomainTask } from '../../../Domain/Model/Task/task';
import { Hall } from './Hall.entity';

@Entity()
export class Task extends DomainTask {
  constructor() {
    super(new TaskDetails());
  }
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TaskDetails, (taskDetails) => taskDetails.Task, {
    cascade: ['insert', 'update'],
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  TaskDetails: TaskDetails;

  @Column({
    type: 'simple-enum',
    enum: TaskStatuses,
    default: TaskStatuses.Queued,
  })
  Status: TaskStatuses;

  @Column({ nullable: true })
  QueueTime: Date;

  @Column({ nullable: true })
  ActiveTime: Date;

  @Column({ nullable: true })
  CancelTime: Date;

  @Column({
    type: 'simple-enum',
    enum: TaskCancelCauses,
    nullable: true,
  })
  TaskCancelCause: TaskCancelCauses;

  @Column({ nullable: true })
  FinishTime: Date;

  // Property required for ORM relation
  @OneToOne(() => Employee, (employee) => employee.ActiveTask, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  employeeActiveTask: Employee;

  // Property required for ORM relation
  @ManyToOne(() => Employee, (employee) => employee.Tasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  employeeFinishedTask: Employee;

  // Property required for ORM relation
  @ManyToOne(() => Employee, (employee) => employee.CancelledTasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  employeeCancelledTask: Employee;

  // Property required for ORM relation
  @ManyToOne(() => Hall, (hall) => hall.Tasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  Hall: Hall;
}
