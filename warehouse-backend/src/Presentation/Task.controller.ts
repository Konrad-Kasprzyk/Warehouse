import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from '../Application/Services/task.service';
import { Task } from '../Domain/Model/Task/task';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  async getAll(): Promise<Task[]> {
    return await this.taskService.GetAllTasks();
  }

  @Get('filter')
  async filterTasks(
    @Query()
    query: {
      hallNumber: number;
      employeeId: number;
      taskStatus: string;
      activationDate: string;
    },
  ): Promise<Task[]> {
    try {
      const activationDate = query.activationDate
        ? new Date(query.activationDate)
        : null;
      return await this.taskService.FilterTasks(
        query.hallNumber,
        query.employeeId,
        query.taskStatus,
        activationDate,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Task> {
    const task = await this.taskService.GetTask(id);
    if (!task)
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    return task;
  }

  @Post()
  async addTask(
    @Body()
    body: {
      hallNumber: number;
      startingShelfGtin: string;
      destinationShelfGtin: string;
      scansRequired: number;
    },
  ): Promise<Task> {
    try {
      return await this.taskService.AddTask(
        body.hallNumber,
        body.startingShelfGtin,
        body.destinationShelfGtin,
        body.scansRequired,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('delete')
  async removeTask(@Body() body: { id: number }): Promise<Task> {
    try {
      return await this.taskService.RemoveTask(body.id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('scanProduct')
  async scanProduct(
    @Body()
    body: {
      taskId: number;
      productGtin: string;
    },
  ): Promise<Task> {
    try {
      return await this.taskService.ScanProduct(body.taskId, body.productGtin);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('scanShelf')
  async scanShelf(
    @Body()
    body: {
      taskId: number;
      shelfGtin: string;
    },
  ): Promise<Task> {
    try {
      return await this.taskService.ScanShelf(body.taskId, body.shelfGtin);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('activateTask')
  async activateTask(
    @Body()
    body: {
      taskId: number;
      assignedEmployeeId: number;
    },
  ): Promise<Task> {
    try {
      return await this.taskService.ActivateTask(
        body.taskId,
        body.assignedEmployeeId,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('finishTask')
  async finishTask(
    @Body()
    body: {
      employeeId: number;
      hallNumber: number;
    },
  ): Promise<Task> {
    try {
      return await this.taskService.FinishTask(
        body.employeeId,
        body.hallNumber,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('cancelTask')
  async cancelTask(
    @Body()
    body: {
      employeeId: number;
      managerId: number;
      taskCancelCause: string;
    },
  ): Promise<Task> {
    try {
      return await this.taskService.CancelTask(
        body.employeeId,
        body.managerId,
        body.taskCancelCause,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
