import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { Employee } from "./Entities/Employee.entity";
import { Hall } from "./Entities/Hall.entity";
import { Product } from "./Entities/Product.entity";
import { ProductModel } from "./Entities/ProductModel.entity";
import { Shelf } from "./Entities/Shelf.entity";
import { Task } from "./Entities/Task.entity";
import { TaskDetails } from "./Entities/TaskDetails.entity";

// Testing database
export const testsqliteconfig: SqliteConnectionOptions = {
  type: "sqlite",
  database: "warehouse_test.db",
  entities: [Employee, Hall, Product, ProductModel, Shelf, Task, TaskDetails],
  synchronize: true,
};

export const localsqliteconfig: SqliteConnectionOptions = {
  type: "sqlite",
  database: "warehouse.db",
  entities: [Employee, Hall, Product, ProductModel, Shelf, Task, TaskDetails],
  synchronize: true,
};

export const localpostgresconfig: PostgresConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin1",
  database: "warehouse",
  entities: [Employee, Hall, Product, ProductModel, Shelf, Task, TaskDetails],
  synchronize: false,
  migrations: ["dist/src/Infrastructure/TypeORM/migrations/*.js"],
  cli: {
    migrationsDir: "src/Infrastructure/TypeORM/migrations",
  },
};
