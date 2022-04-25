import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './Entities/Employee.entity';
import { Hall } from './Entities/Hall.entity';
import { Product } from './Entities/Product.entity';
import { ProductModel } from './Entities/ProductModel.entity';
import { Shelf } from './Entities/Shelf.entity';
import { Task } from './Entities/Task.entity';
import { TaskDetails } from './Entities/TaskDetails.entity';
import { testsqliteconfig } from './ormconfig';
import { TestTypeOrmUoW } from './testTypeormUoW.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(testsqliteconfig),
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
  providers: [{ provide: 'IUnitOfWork', useClass: TestTypeOrmUoW }],
  exports: [{ provide: 'IUnitOfWork', useClass: TestTypeOrmUoW }],
})
export class TestTypeORMModule {}
