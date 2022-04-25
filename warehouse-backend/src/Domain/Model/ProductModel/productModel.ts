/** Store information about product model. Many products can have same product model. */
export class ProductModel {
  /**
   * @throws Brand or part number is empty or null
   */
  constructor(partNumber: string, brand: string, name: string) {
    if (!brand || !partNumber)
      throw new Error('Brand or part number is empty or null');
    this.Name = name;
    this.Brand = brand;
    this.PartNumber = partNumber;
  }
  readonly id: number;
  /** Product model name used only for warehouse information. */
  readonly Name: string;
  /** Brand name. */
  readonly Brand: string;
  /** Manufacturer product number. */
  readonly PartNumber: string;
}
