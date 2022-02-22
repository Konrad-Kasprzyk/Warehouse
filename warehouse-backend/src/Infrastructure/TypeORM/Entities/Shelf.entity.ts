import { Shelf as DomainShelf, ShelfPurposes } from "../../../Domain/Model/Hall/shelf";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Hall } from "./Hall.entity";

@Entity()
export class Shelf extends DomainShelf {
  constructor() {
    super(1, "gtin", ShelfPurposes.Storage);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "simple-array", default: "" })
  ProductGtins: string[];

  @Column({ nullable: true })
  ProductModelPartNumber: string;

  @Column({ nullable: true })
  ProductModelBrand: string;

  @Column()
  Number: number;

  @Column({ unique: true })
  Gtin: string;

  @Column({
    type: "simple-enum",
    enum: ShelfPurposes,
    default: ShelfPurposes.Storage,
  })
  ShelfPurpose: ShelfPurposes;

  // Property required for ORM relation
  @ManyToOne(() => Hall, (hall) => hall.Shelves, { onDelete: "SET NULL", nullable: true })
  Hall: Hall;
}
