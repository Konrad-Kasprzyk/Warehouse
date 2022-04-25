import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './Entities/Employee.entity';
import { Hall } from './Entities/Hall.entity';
import { Product } from './Entities/Product.entity';
import { ProductModel } from './Entities/ProductModel.entity';
import { Shelf } from './Entities/Shelf.entity';
import { Task } from './Entities/Task.entity';
import { TaskDetails } from './Entities/TaskDetails.entity';
import { TypeOrmUoW } from './typeormUoW.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Hall,
      Product,
      ProductModel,
      Shelf,
      Task,
      TaskDetails,
    ]),
  ],
  controllers: [],
  providers: [{ provide: 'IUnitOfWork', useClass: TypeOrmUoW }],
  exports: [{ provide: 'IUnitOfWork', useClass: TypeOrmUoW }],
})
export class TypeORMModule {}
