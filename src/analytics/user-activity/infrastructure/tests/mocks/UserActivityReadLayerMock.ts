import { IUserActivityReadLayer } from '../../../application/IUserActivityReadLayer';

export class UserActivityReadLayerMock implements IUserActivityReadLayer {
  public constructor(
    private storedData: {
      userId: string;
      email: string;
      createdAt: Date;
    }[] = [],
  ) {}

  public stored(): { userId: string; email: string; createdAt: Date }[] {
    return this.storedData;
  }

  public clean(): void {
    this.storedData = [];
  }

  public saveUserRegistration(
    userId: string,
    email: string,
    createdAt: Date,
  ): Promise<void> {
    this.storedData.push({ userId, email, createdAt });
    return Promise.resolve();
  }
}
