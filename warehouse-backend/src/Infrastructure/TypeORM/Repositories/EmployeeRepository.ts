import { IEmployeeRepository } from "../../../Application/Repositories/IEmployeeRepository";
import { Roles } from "../../../Domain/Model/Employee/employee";
import { EntityManager, Repository } from "typeorm";
import { Employee } from "../Entities/Employee.entity";
import { Hall } from "../Entities/Hall.entity";

export class EmployeeRepo implements IEmployeeRepository {
  constructor(entityManager: EntityManager) {
    this.employeeRepository = entityManager.getRepository<Employee>(Employee);
  }
  private employeeRepository: Repository<Employee>;

  UpdateEmployee(employee: Employee): Promise<Employee> {
    return this.employeeRepository.save(employee);
  }

  FilterEmployees(role: Roles, hall: Hall): Promise<Employee[]> {
    let query: {
      Role?: Roles;
      Hall?: Hall;
    } = {};
    if (role) query.Role = role;
    if (hall) query.Hall = hall;
    return this.employeeRepository.find(query);
  }

  GetEmployee(id: number): Promise<Employee> {
    return this.employeeRepository.findOne({ id: id });
  }

  async RemoveEmployee(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ id: id });
    if (!employee) return Promise.reject(`Employee with id ${id} not found`);
    return await this.employeeRepository.remove(employee);
  }

  GetAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async AddEmployee(employee: Employee): Promise<Employee> {
    const newEmployee = this.employeeRepository.create(employee);
    return this.employeeRepository.save(newEmployee);
  }
}
