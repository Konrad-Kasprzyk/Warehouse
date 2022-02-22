import { Test, TestingModule } from "@nestjs/testing";
import * as _ from "lodash";
import { Roles } from "../../Domain/Model/Employee/employee";
import { TestTypeORMModule } from "../../Infrastructure/TypeORM/testTypeorm.module";
import { EmployeeService } from "../Services/employee.service";
import { HallService } from "../Services/hall.service";

describe("EmployeeService", () => {
  let module: TestingModule;
  let employeeService: EmployeeService;
  let hallService: HallService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestTypeORMModule],
      providers: [EmployeeService, HallService],
    }).compile();
    employeeService = await module.resolve<EmployeeService>(EmployeeService);
    hallService = await module.resolve<HallService>(HallService);
  });

  it("should get an employee", async () => {
    const employee = await employeeService.GetEmployee(1);

    expect(employee).toBeDefined();
    expect(employee.ActiveTask).toBeDefined();
  });

  it("should return an array of all employees", async () => {
    const allEmployees = await employeeService.GetAllEmployees();

    expect(allEmployees).toBeDefined();
    expect(allEmployees[0]).toBeDefined();
    expect(allEmployees[0].ActiveTask).toBeDefined();
    expect(allEmployees.length).toBeGreaterThan(1);
  });

  it("should return an array of employees without managers", async () => {
    const employees = await employeeService.FilterEmployees(Roles.Employee, null);

    employees.forEach((employee) => expect(employee.Role).toBe(Roles.Employee));
    expect(employees.length).toBeGreaterThan(1);
  });

  it("should return an array only of managers", async () => {
    const employees = await employeeService.FilterEmployees(Roles.Manager, null);

    employees.forEach((employee) => expect(employee.Role).toBe(Roles.Manager));
    expect(employees.length).toBeGreaterThan(1);
  });

  it("should return an employees only from given hall", async () => {
    const hall = await hallService.GetHall(1);
    const employees = await employeeService.FilterEmployees(null, hall.Number);

    hall.Employees.forEach((employee) =>
      expect(employees.some((e) => _.isEqual(e, employee))).toBeTruthy()
    );
  });

  it("should add an manager", async () => {
    const employee = await employeeService.AddEmployee(1, Roles.Manager, "name", "surname");

    expect(employee.Name).toEqual("name");
    expect(employee.Surname).toEqual("surname");
    expect(employee.Role).toBe(Roles.Manager);
  });

  it("should not add an employee because arguments are missing", async () => {
    await expect(
      employeeService.AddEmployee(null, Roles.Manager, "name", "surname")
    ).rejects.toBeDefined();
    await expect(employeeService.AddEmployee(1, null, "name", "surname")).rejects.toBeDefined();
    await expect(
      employeeService.AddEmployee(1, Roles.Manager, null, "surname")
    ).rejects.toBeDefined();
    await expect(employeeService.AddEmployee(1, Roles.Manager, "name", null)).rejects.toBeDefined();
  });

  it("should not add an employee because arguments are improper", async () => {
    await expect(
      employeeService.AddEmployee(-42, Roles.Manager, "name", "surname")
    ).rejects.toBeDefined();
    await expect(
      employeeService.AddEmployee(1, "wrong role", "name", "surname")
    ).rejects.toBeDefined();
  });

  it("should remove an employee", async () => {
    const employee = await employeeService.RemoveEmployee(1);

    expect(employee).toBeDefined();
  });
});
