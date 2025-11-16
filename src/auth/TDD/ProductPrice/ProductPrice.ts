import { InvalidPriceError } from './InvalidPriceError';

export class ProductPrice {
  public price: number;

  public constructor(price: number) {
    if (price < 0) {
      throw new InvalidPriceError();
    }

    this.price = price;
  }
}
