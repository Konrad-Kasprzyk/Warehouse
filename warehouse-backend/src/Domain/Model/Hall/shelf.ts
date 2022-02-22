import { Product } from "../Product/product";

export enum ShelfPurposes {
  Storage = "Storage",
  Delivery = "Delivery",
  Shipment = "Shipment",
}

/** Store single shelf information and products put on it. */
export class Shelf {
  /**
   * @throws Shelf number is missing or below zero or shelf GTIN is null or empty
   */
  constructor(number: number, gtin: string, shelfPurpose: ShelfPurposes) {
    if (!number || number < 0) throw new Error("Hall number is missing or below zero.");
    if (!gtin) throw new Error("Shelf GTIN is null or empty.");
    if (!shelfPurpose) throw new Error("Missing shelf purpose.");

    this.Number = number;
    this.Gtin = gtin;
    this.ShelfPurpose = shelfPurpose;
  }
  readonly id: number;
  /** stored product GTINs on this shelf. */
  ProductGtins: string[];
  /** If shelf is empty the part number is null. */
  ProductModelPartNumber: string;
  /** If shelf is empty the product brand is null. */
  ProductModelBrand: string;
  /** Unique shelf number */
  readonly Number: number;
  readonly Gtin: string;
  /** E.g. storage, delivery, shipment. */
  readonly ShelfPurpose: ShelfPurposes;

  /**
   * Add product GTIN to this shelf. Won't allow adding duplicates.
   * The product with the wrong product model will not be added.
   * @returns True if the product has been added, false otherwise.
   */
  AddProduct(product: Product): boolean {
    if (this.ProductGtins?.includes(product.Gtin)) return false;
    if (!this.ProductGtins || this.ProductGtins.length == 0) {
      this.ProductGtins = [];
      this.ProductModelPartNumber = product.ProductModel.PartNumber;
      this.ProductModelBrand = product.ProductModel.Brand;
    }

    if (
      product.ProductModel.PartNumber != this.ProductModelPartNumber ||
      product.ProductModel.Brand != this.ProductModelBrand
    )
      return false;

    this.ProductGtins.push(product.Gtin);
    return true;
  }

  /**
   * Remove product GTIN from this shelf. If the shelf is empty, remove the assigned product model.
   * @returns True when product GTIN has been removed, false otherwise.
   */
  RemoveProduct(productGtin: string): boolean {
    const index = this.ProductGtins.indexOf(productGtin);
    const removed = true ? index > -1 : false;
    if (!removed) return false;
    this.ProductGtins.splice(index, 1);
    if (this.ProductGtins.length != 0) return true;
    this.ProductModelPartNumber = null;
    this.ProductModelBrand = null;
    this.ProductGtins = [];
    return true;
  }

  /** Remove all product GTINs from shelf and assigned product model. */
  ClearShelf(): void {
    this.ProductGtins = [];
    this.ProductModelPartNumber = null;
    this.ProductModelBrand = null;
  }
}
