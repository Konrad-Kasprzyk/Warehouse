import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskDetails as DomainTaskDetails } from '../../../Domain/Model/Task/taskDetails';
import { Shelf } from './Shelf.entity';
import { Task } from './Task.entity';

@Entity()
export class TaskDetails extends DomainTaskDetails {
  constructor() {
    const startingShelf = new Shelf();
    startingShelf.ProductModelBrand = 'brand';
    startingShelf.ProductModelPartNumber = 'partNumber';
    super(1, startingShelf, new Shelf());
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ScansRequired: number;

  @Column()
  ProductModelPartNumber: string;

  @Column()
  ProductModelBrand: string;

  @Column()
  StartingShelfGtin: string;

  @Column()
  DestinationShelfGtin: string;

  @Column({ type: 'simple-array', default: '' })
  PickedUpProductsGtins: string[];

  @Column({ type: 'simple-array', default: '' })
  StoredProductsGtins: string[];

  @Column({ nullable: true })
  ScannedShelfGtin: string;

  // Property required for ORM relation
  @OneToOne(() => Task, (task) => task.TaskDetails, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  Task: Task;
}
