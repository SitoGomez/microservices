export class LicencePriceCalculator {
  private readonly numberOfPurchasedLicenses: number;

  public constructor(numberOfPurchasedLicenses: number) {
    this.numberOfPurchasedLicenses = numberOfPurchasedLicenses;
  }
  public calculateTotal(): number {
    return this.numberOfPurchasedLicenses * 299;
  }
}
