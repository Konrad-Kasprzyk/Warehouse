import { ProductModel as DomainProductModel } from "../../../Domain/Model/ProductModel/productModel";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product.entity";

@Entity()
export class ProductModel extends DomainProductModel {
  constructor() {
    super("part number", "brand", "name");
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @Column()
  Brand: string;

  @Column()
  PartNumber: string;

  // Property required for ORM relation
  @OneToMany(() => Product, (product) => product.ProductModel, {
    onDelete: "SET NULL",
    nullable: true,
  })
  Products: Product[];
}
