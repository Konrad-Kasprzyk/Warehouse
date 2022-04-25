import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { HallService } from '../Application/Services/hall.service';
import { Hall } from '../Domain/Model/Hall/hall';

@Controller('hall')
export class HallController {
  constructor(private readonly hallService: HallService) {}
  @Get()
  async getAll(): Promise<Hall[]> {
    return await this.hallService.GetAllHalls();
  }

  @Get(':hallNumber')
  async getOne(@Param('hallNumber') hallNumber: number): Promise<Hall> {
    const hall = await this.hallService.GetHall(hallNumber);
    if (!hall)
      throw new HttpException(
        `Hall with number ${hallNumber} not found`,
        HttpStatus.NOT_FOUND,
      );
    return hall;
  }

  @Post()
  async addHall(@Body() body: { hallNumber: number }): Promise<Hall> {
    try {
      return await this.hallService.AddHall(body.hallNumber);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('moveEmployee')
  async moveEmployeeToAnotherHall(
    @Body() body: { employeeId: number; hallNumber: number },
  ): Promise<Hall> {
    try {
      return await this.hallService.MoveEmployeeToAnotherHall(
        body.employeeId,
        body.hallNumber,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('delete')
  async removeHall(@Body() body: { hallNumber: number }): Promise<Hall> {
    try {
      return await this.hallService.RemoveHall(body.hallNumber);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
