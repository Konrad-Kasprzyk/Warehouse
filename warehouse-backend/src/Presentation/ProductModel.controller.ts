import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ProductModelService } from '../Application/Services/productModel.service';
import { ProductModel } from '../Domain/Model/ProductModel/productModel';

@Controller('productModel')
export class ProductModelController {
  constructor(private readonly productModelService: ProductModelService) {}
  @Get()
  async getAll(): Promise<ProductModel[]> {
    return await this.productModelService.getAllProductModels();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ProductModel> {
    const productModel = await this.productModelService.GetProductModel(id);
    if (!productModel)
      throw new HttpException(
        `Product model with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    return productModel;
  }

  @Post()
  async addProductModel(
    @Body() body: { name: string; brand: string; partNumber: string },
  ): Promise<ProductModel> {
    try {
      return await this.productModelService.AddProductModel(
        body.name,
        body.brand,
        body.partNumber,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('delete')
  async removeProductModel(
    @Body() body: { id: number },
  ): Promise<ProductModel> {
    try {
      return await this.productModelService.RemoveProductModel(body.id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
