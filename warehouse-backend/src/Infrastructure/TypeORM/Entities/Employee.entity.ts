import {
  Roles,
  Employee as DomainEmployee,
} from '../../../Domain/Model/Employee/employee';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hall } from './Hall.entity';
import { Task } from './Task.entity';

@Entity()
export class Employee extends DomainEmployee {
  constructor() {
    super('name', 'surname', Roles.Employee);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @Column()
  Surname: string;

  @Column({
    type: 'simple-enum',
    enum: Roles,
    default: Roles.Employee,
  })
  Role: Roles;

  @OneToOne(() => Task, (task) => task.employeeActiveTask, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  ActiveTask: Task;

  @OneToMany(() => Task, (task) => task.employeeFinishedTask, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  Tasks: Task[];

  @OneToMany(() => Task, (task) => task.employeeCancelledTask, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  CancelledTasks: Task[];

  // Property required for ORM relation
  @ManyToOne(() => Hall, (hall) => hall.Employees, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  Hall: Hall;

  @BeforeInsert()
  @BeforeUpdate()
  async emptyArrayChecks() {
    if (Array.isArray(this.Tasks) && this.Tasks.length == 0) this.Tasks = null;
    if (Array.isArray(this.CancelledTasks) && this.CancelledTasks.length == 0)
      this.CancelledTasks = null;
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    if (!this.Tasks) this.Tasks = [];
    if (!this.CancelledTasks) this.CancelledTasks = [];
  }
}
