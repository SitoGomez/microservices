export class LicencePriceCalculator {
  private readonly numberOfPurchasedLicenses: number;

  public constructor(numberOfPurchasedLicenses: number) {
    this.numberOfPurchasedLicenses = numberOfPurchasedLicenses;
  }
  public calculateTotal(): number {
    if (this.numberOfPurchasedLicenses === 3) {
      return this.numberOfPurchasedLicenses * 239;
    }

    return this.numberOfPurchasedLicenses * 299;
  }
}
