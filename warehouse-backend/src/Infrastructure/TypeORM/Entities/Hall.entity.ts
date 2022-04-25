import { Hall as DomainHall } from '../../../Domain/Model/Hall/hall';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './Employee.entity';
import { Product } from './Product.entity';
import { Shelf } from './Shelf.entity';
import { Task } from './Task.entity';

@Entity()
export class Hall extends DomainHall {
  constructor() {
    super(1);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  Number: number;

  @OneToMany(() => Employee, (employee) => employee.Hall, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  Employees: Employee[];

  @OneToMany(() => Shelf, (shelf) => shelf.Hall, {
    cascade: ['insert', 'update'],
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  Shelves: Shelf[];

  @OneToMany(() => Product, (product) => product.Hall, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  Products: Product[];

  @OneToMany(() => Task, (task) => task.Hall, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  Tasks: Task[];

  @BeforeInsert()
  @BeforeUpdate()
  async emptyArrayChecks() {
    if (Array.isArray(this.Employees) && this.Employees.length == 0)
      this.Employees = null;
    if (Array.isArray(this.Shelves) && this.Shelves.length == 0)
      this.Shelves = null;
    if (Array.isArray(this.Tasks) && this.Tasks.length == 0) this.Tasks = null;
    if (Array.isArray(this.Products) && this.Products.length == 0)
      this.Products = null;
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    if (!this.Employees) this.Employees = [];
    if (!this.Shelves) this.Shelves = [];
    if (!this.Tasks) this.Tasks = [];
    if (!this.Products) this.Products = [];
  }
}
