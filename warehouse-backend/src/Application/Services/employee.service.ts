import { Inject, Injectable } from "@nestjs/common";
import { Employee, Roles } from "../../Domain/Model/Employee/employee";
import { Hall } from "../../Domain/Model/Hall/hall";
import { IUnitOfWork } from "../IUnitOfWork";

@Injectable()
export class EmployeeService {
  constructor(@Inject("IUnitOfWork") private readonly uow: IUnitOfWork) {}

  GetAllEmployees(): Promise<Employee[]> {
    return this.uow.Employee.GetAllEmployees();
  }

  async FilterEmployees(role: string, hallNumber: number): Promise<Employee[]> {
    let castedRole: Roles = null;
    let hall: Hall = null;
    if (role) {
      castedRole = Roles[role];
      if (!castedRole) return Promise.reject("Invalid employee role");
    }
    if (hallNumber) {
      hall = await this.uow.Hall.GetHall(hallNumber);
      if (!hall) return Promise.reject(`Hall with number ${hallNumber} not found`);
    }
    return this.uow.Employee.FilterEmployees(castedRole, hall);
  }

  GetEmployee(id: number): Promise<Employee> {
    return this.uow.Employee.GetEmployee(id);
  }

  AddEmployee(hallNumber: number, role: string, name: string, surname: string): Promise<Employee> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      const castedRole = Roles[role];
      if (!castedRole) return Promise.reject("Invalid employee role");
      const hall = await uow.Hall.GetHall(hallNumber);
      if (!hall) return Promise.reject(`Hall with number ${hallNumber} not found`);
      let employee = new Employee(name, surname, castedRole);
      employee = await uow.Employee.AddEmployee(employee);
      hall.Employees.push(employee);
      await uow.Hall.UpdateHall(hall);
      return employee;
    });
  }

  RemoveEmployee(id: number): Promise<Employee> {
    return this.uow.InTransaction(async (uow: IUnitOfWork) => {
      return await uow.Employee.RemoveEmployee(id);
    });
  }
}
