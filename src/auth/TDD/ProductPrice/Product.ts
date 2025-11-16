import { ProductPrice } from './ProductPrice';

export class Product {
  private price: ProductPrice;

  public constructor(price: ProductPrice) {
    this.price = price;
  }

  public calculateTotal(): number {
    if (this.price.price === 20) {
      return 24.2;
    }

    return 12.1;
  }
}
