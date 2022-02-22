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
import { HallService } from "../Application/Services/hall.service";
import { Shelf } from "../Domain/Model/Hall/shelf";

@Controller("shelf")
export class ShelfController {
  constructor(private readonly hallService: HallService) {}
  @Get()
  async getAll(): Promise<Shelf[]> {
    return await this.hallService.GetAllShelves();
  }

  @Get("filter")
  async filterShelves(
    @Query() query: { hallNumber: number; productModelId: number; shelfPurpose: string }
  ): Promise<Shelf[]> {
    try {
      return await this.hallService.FilterShelves(
        query.hallNumber,
        query.productModelId,
        query.shelfPurpose
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(":gtin")
  async getOne(@Param("gtin") gtin: string): Promise<Shelf> {
    const shelf = await this.hallService.GetShelf(gtin);
    if (!shelf) throw new HttpException(`Shelf with GTIN ${gtin} not found`, HttpStatus.NOT_FOUND);
    return shelf;
  }

  @Post()
  async addShelf(
    @Body() body: { hallNumber: number; shelfNumber: number; gtin: string; shelfPurpose: string }
  ): Promise<Shelf> {
    try {
      return await this.hallService.AddShelf(
        body.hallNumber,
        body.shelfNumber,
        body.gtin,
        body.shelfPurpose
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("delete")
  async removeShelf(@Body() body: { gtin: string }): Promise<Shelf> {
    try {
      return await this.hallService.RemoveShelf(body.gtin);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
