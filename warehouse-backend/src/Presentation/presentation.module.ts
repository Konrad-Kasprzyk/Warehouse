import { Module } from '@nestjs/common';
import { ApplicationModule } from '../Application/application.module';
import { EmployeeController } from './Employee.controller';
import { HallController } from './Hall.controller';
import { ProductController } from './Product.controller';
import { ProductModelController } from './ProductModel.controller';
import { ShelfController } from './Shelf.controller';
import { TaskController } from './Task.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [
    EmployeeController,
    HallController,
    ShelfController,
    ProductController,
    ProductModelController,
    TaskController,
  ],
  providers: [],
  exports: [],
})
export class PresentationModule {}
