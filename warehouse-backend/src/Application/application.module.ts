import { Module } from "@nestjs/common";
import { DomainModule } from "../Domain/domain.module";
import { TypeORMModule } from "../Infrastructure/TypeORM/typeorm.module";
import { EmployeeService } from "./Services/employee.service";
import { HallService } from "./Services/hall.service";
import { ProductService } from "./Services/product.service";
import { ProductModelService } from "./Services/productModel.service";
import { TaskService } from "./Services/task.service";

@Module({
  imports: [DomainModule, TypeORMModule],
  controllers: [],
  providers: [EmployeeService, HallService, ProductService, ProductModelService, TaskService],
  exports: [EmployeeService, HallService, ProductService, ProductModelService, TaskService],
})
export class ApplicationModule {}
