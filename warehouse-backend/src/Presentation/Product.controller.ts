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
import { ProductService } from "../Application/Services/product.service";
import { Product } from "../Domain/Model/Product/product";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async getAll(): Promise<Product[]> {
    return await this.productService.GetAllProducts();
  }

  @Get("filter")
  async filterProducts(
    @Query()
    query: {
      hallNumber: number;
      shelfGtin: string;
      productModelId: number;
      productGtins: string;
    }
  ): Promise<Product[]> {
    try {
      const productGtins: string[] = query.productGtins ? query.productGtins.split(",") : null;
      return await this.productService.FilterProducts(
        query.hallNumber,
        query.shelfGtin,
        query.productModelId,
        productGtins
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(":gtin")
  async getOne(@Param("gtin") gtin: string): Promise<Product> {
    const product = await this.productService.GetProduct(gtin);
    if (!product)
      throw new HttpException(`Product with GTIN ${gtin} not found`, HttpStatus.NOT_FOUND);
    return product;
  }

  @Post()
  async addProduct(
    @Body()
    body: {
      hallNumber: number;
      shelfGtin: string;
      productModelId: number;
      productGtin: string;
    }
  ): Promise<Product> {
    try {
      return await this.productService.AddProduct(
        body.hallNumber,
        body.shelfGtin,
        body.productModelId,
        body.productGtin
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("delete")
  async removeProduct(@Body() body: { gtin: string }): Promise<Product> {
    try {
      return await this.productService.RemoveProduct(body.gtin);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
