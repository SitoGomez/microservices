export class InvalidPriceError extends Error {
  public constructor() {
    super('Invalid price');
    this.name = 'InvalidPriceError';
  }
}
