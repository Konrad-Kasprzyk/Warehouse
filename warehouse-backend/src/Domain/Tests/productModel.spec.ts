import { ProductModel } from "../Model/ProductModel/productModel";

describe("ProductModel", () => {
  it("should be defined", async () => {
    expect(new ProductModel("part nubmer", "brand", "name")).toBeDefined();
  });

  it("should throw error", () => {
    expect(() => new ProductModel(null, "brand", "name")).toThrowError();
    expect(() => new ProductModel("part nubmer", null, "name")).toThrowError();
  });
});
