import { InvalidPriceError } from './InvalidPriceError';
import { Product } from './Product';
import { ProductPrice } from './ProductPrice';

describe('Given a product price', () => {
  describe('When the price is 10', () => {
    it('Then the total should be 12', () => {
      const price = new Product(new ProductPrice(10));

      expect(price.calculateTotal()).toBe(12.1);
    });
  });

  describe('When the price is 20', () => {
    it('Then the total should be 24.2', () => {
      const price = new Product(new ProductPrice(20));

      expect(price.calculateTotal()).toBe(24.2);
    });
  });

  describe('When the price is negative', () => {
    it('Then the total should be 0', () => {
      expect(() => {
        new Product(new ProductPrice(-5));
      }).toThrow(InvalidPriceError);
    });
  });
});
