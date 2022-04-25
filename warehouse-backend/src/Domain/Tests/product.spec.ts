import { Product } from '../Model/Product/product';
import { ProductModel } from '../Model/ProductModel/productModel';

describe('Product', () => {
  it('should be defined', () => {
    expect(
      new Product(new ProductModel('part nubmer', 'brand', 'name'), 'gtin'),
    ).toBeDefined();
  });

  it('should throw error', () => {
    expect(() => new Product(null, 'gtin')).toThrowError();
    expect(
      () => new Product(new ProductModel('part nubmer', 'brand', 'name'), null),
    ).toThrowError();
  });
});
