import { Employee, Roles } from "../Model/Employee/employee";

describe("Employee", () => {
  it("should be defined", () => {
    expect(new Employee("name", "surname", Roles.Employee)).toBeDefined();
  });

  it("should throw error", () => {
    expect(() => new Employee(null, "surname", Roles.Employee)).toThrowError();
    expect(() => new Employee(null, null, Roles.Employee)).toThrowError();
    expect(() => new Employee(null, "surname", null)).toThrowError();
  });
});
