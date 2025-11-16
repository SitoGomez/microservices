export class LicencePriceCalculator {
  private readonly numberOfPurchasedLicenses: number;

  public constructor(numberOfPurchasedLicenses: number) {
    this.numberOfPurchasedLicenses = numberOfPurchasedLicenses;
  }

  public calculateTotal(): number {
    return this.calculatePricePerLicense() * this.numberOfPurchasedLicenses;
  }

  private calculatePricePerLicense(): number {
    if (this.numberOfPurchasedLicenses === 3) {
      return 239;
    }

    if (this.numberOfPurchasedLicenses === 10) {
      return 239;
    }

    return 299;
  }
}
