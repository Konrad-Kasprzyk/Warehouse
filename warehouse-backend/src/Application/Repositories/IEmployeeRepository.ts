import { Employee, Roles } from "../../Domain/Model/Employee/employee";
import { Hall } from "../../Domain/Model/Hall/hall";

export interface IEmployeeRepository {
  GetAllEmployees(): Promise<Employee[]>;

  FilterEmployees(role: Roles, hall: Hall): Promise<Employee[]>;

  GetEmployee(id: number): Promise<Employee>;

  AddEmployee(employee: Employee): Promise<Employee>;

  UpdateEmployee(employee: Employee): Promise<Employee>;

  RemoveEmployee(id: number): Promise<Employee>;
}
