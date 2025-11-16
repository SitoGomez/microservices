import { LicencePriceCalculator } from './LicencePriceCalculator';

describe('Given a company purchasing licenses', () => {
  describe('When one licence is purchased', () => {
    it('Then the total should be 299', () => {
      const NUMBER_OF_PURCHASED_LICENSES = 1;

      const licencePriceCalculator = new LicencePriceCalculator(
        NUMBER_OF_PURCHASED_LICENSES,
      );

      expect(licencePriceCalculator.calculateTotal()).toBe(299);
    });
  });

  describe('When there are two licences purchased', () => {
    it('Then the total should be 598', () => {
      const NUMBER_OF_PURCHASED_LICENSES = 2;

      const licencePriceCalculator = new LicencePriceCalculator(
        NUMBER_OF_PURCHASED_LICENSES,
      );

      expect(licencePriceCalculator.calculateTotal()).toBe(598);
    });
  });

  describe('When there are three licences purchased', () => {
    it('Then the total should be 717', () => {
      const NUMBER_OF_PURCHASED_LICENSES = 3;

      const licencePriceCalculator = new LicencePriceCalculator(
        NUMBER_OF_PURCHASED_LICENSES,
      );

      expect(licencePriceCalculator.calculateTotal()).toBe(717);
    });
  });
});
