import { Shelf } from "../Hall/shelf";
import { Product } from "../Product/product";

/** Store task details like shelves to scan and scanned products. */
export class TaskDetails {
  /**
   * @throws Starting or destination shelf is null. Required scans are missing or below 1.
   * Starting shelf is missing product model. Starting and destination shelves
   * store different product model.
   */
  constructor(scansRequired: number, startingShelf: Shelf, destinationShelf: Shelf) {
    if (!scansRequired || scansRequired < 1)
      throw new Error("Required scans are missing or below 1.");
    if (!startingShelf) throw new Error("TaskDetails is missing starting shelf.");
    if (!startingShelf.ProductModelPartNumber || !startingShelf.ProductModelBrand)
      throw new Error("Starting shelf is missing product model.");
    if (!destinationShelf) throw new Error("TaskDetails is missing destination shelf.");
    if (startingShelf == destinationShelf)
      throw new Error("Starting and destination shelf are the same shelf.");
    if (
      destinationShelf.ProductModelPartNumber &&
      destinationShelf.ProductModelBrand &&
      (startingShelf.ProductModelPartNumber != destinationShelf.ProductModelPartNumber ||
        startingShelf.ProductModelBrand != destinationShelf.ProductModelBrand)
    )
      throw new Error("Starting shelf has an invalid product model for the destination shelf.");
    this.ScansRequired = scansRequired;
    this.ProductModelPartNumber = startingShelf.ProductModelPartNumber;
    this.ProductModelBrand = startingShelf.ProductModelBrand;
    this.StartingShelfGtin = startingShelf.Gtin;
    this.DestinationShelfGtin = destinationShelf.Gtin;
  }
  readonly id: number;
  readonly ScansRequired: number;
  readonly ProductModelPartNumber: string;
  readonly ProductModelBrand: string;
  readonly StartingShelfGtin: string;
  readonly DestinationShelfGtin: string;
  /** Accepted products scans from starting shelf. */
  PickedUpProductsGtins: string[];
  /** Accepted products scans from destination shelf. */
  StoredProductsGtins: string[];
  /** Before picking and storing a product on a shelf, that shelf must be scanned. Scan shelf once for all products
   *  on that shelf. */
  ScannedShelfGtin: string;

  /**
   * Accepts the shelf scan when that shelf is starting or destination shelf.
   * This allows picking and storing products on that shelf.
   * @param shelf Scanned shelf.
   * @returns True when shelf scan is accepted, false otherwise.
   */
  ScanShelf(shelf: Shelf): boolean {
    if (!shelf || !shelf.Gtin) return false;
    if (this.StartingShelfGtin != shelf.Gtin && this.DestinationShelfGtin != shelf.Gtin)
      return false;
    this.ScannedShelfGtin = shelf.Gtin;
    return true;
  }

  /**
   * Accept the product scan when its product model is appropriate.
   * Scanning proper shelf is required for accepting scan.
   * When task has necessary scans number to finish then scan is discarded.
   * @param product Scanned product.
   * @returns True when product scan is accepted, false otherwise.
   */
  ScanProduct(product: Product): boolean {
    if (!product || !product.ProductModel) return false;

    if (
      product.ProductModel.Brand != this.ProductModelBrand ||
      product.ProductModel.PartNumber != this.ProductModelPartNumber
    )
      return false;

    if (!this.StoredProductsGtins) this.StoredProductsGtins = [];
    if (!this.PickedUpProductsGtins) this.PickedUpProductsGtins = [];

    // Product already stored
    if (this.StoredProductsGtins.includes(product.Gtin)) return false;

    // Product has been picked up from starting shelf
    if (this.PickedUpProductsGtins.includes(product.Gtin)) {
      if (this.ScannedShelfGtin != this.DestinationShelfGtin) return false;

      const index = this.PickedUpProductsGtins.indexOf(product.Gtin);
      if (index > -1) this.PickedUpProductsGtins.splice(index, 1);

      this.StoredProductsGtins.push(product.Gtin);
      return true;
    }
    // Picking product from starting shelf
    if (this.PickedUpProductsGtins.length + this.StoredProductsGtins.length >= this.ScansRequired)
      return false;
    if (this.ScannedShelfGtin != this.StartingShelfGtin) return false;
    this.PickedUpProductsGtins.push(product.Gtin);
    return true;
  }

  /**
   * Checks if all products are picked up from starting shelf and stored on destination shelf.
   * @returns True when all required products are on destination shelf, false otherwise.
   */
  IsCompleted(): boolean {
    if (!this.PickedUpProductsGtins || !this.StoredProductsGtins) return false;
    if (this.PickedUpProductsGtins.length > 0) return false;
    if (this.StoredProductsGtins.length < this.ScansRequired) return false;
    return true;
  }
}
