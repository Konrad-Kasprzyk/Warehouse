import { ProductModel } from '../ProductModel/productModel';

/** Store information about single product. */
export class Product {
  /**
   * @param productModel Product model of this product.
   * @param gtin GTIN of this product.
   * @throws Product model is null or product GTIN is null or empty
   */
  constructor(productModel: ProductModel, gtin: string) {
    if (!productModel) throw new Error('Product model is null.');
    if (!gtin) throw new Error('Product GTIN is null or empty.');
    this.Gtin = gtin;
    this.ProductModel = productModel;
  }
  readonly id: number;
  /** Product model of this product. */
  readonly ProductModel: ProductModel;
  /** GTIN of this product. */
  readonly Gtin: string;
}
