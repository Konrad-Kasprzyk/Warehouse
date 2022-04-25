import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product as DomainProduct } from '../../../Domain/Model/Product/product';
import { ProductModel } from './ProductModel.entity';
import { Hall } from './Hall.entity';

@Entity()
export class Product extends DomainProduct {
  constructor() {
    super(new ProductModel(), 'gtin');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductModel, (productModel) => productModel.Products, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  ProductModel: ProductModel;

  @Column({ unique: true })
  Gtin: string;

  // Property required for ORM relation
  @ManyToOne(() => Hall, (hall) => hall.Products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  Hall: Hall;
}
