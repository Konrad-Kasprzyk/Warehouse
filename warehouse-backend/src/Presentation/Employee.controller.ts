import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { EmployeeService } from "../Application/Services/employee.service";
import { Employee } from "../Domain/Model/Employee/employee";

@Controller("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get()
  async getAll(): Promise<Employee[]> {
    return await this.employeeService.GetAllEmployees();
  }

  @Get("filter")
  async filterEmployees(@Query() query: { role: string; hallNumber: number }): Promise<Employee[]> {
    try {
      return await this.employeeService.FilterEmployees(query.role, query.hallNumber);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(":id")
  async getOne(@Param("id") id: number): Promise<Employee> {
    const employee = await this.employeeService.GetEmployee(id);
    if (!employee)
      throw new HttpException(`Employee with id ${id} not found`, HttpStatus.NOT_FOUND);
    return employee;
  }

  @Post()
  async addEmployee(
    @Body() body: { hallNumber: number; role: string; name: string; surname: string }
  ): Promise<Employee> {
    try {
      return await this.employeeService.AddEmployee(
        body.hallNumber,
        body.role,
        body.name,
        body.surname
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("delete")
  async removeEmployee(@Body() body: { id: number }): Promise<Employee> {
    try {
      return await this.employeeService.RemoveEmployee(body.id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
