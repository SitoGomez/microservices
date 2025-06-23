export interface IUserActivityReadLayer {
  saveUserRegistration(
    userId: string,
    email: string,
    createdAt: Date,
  ): Promise<void>;
}

export const USER_ACTIVITY_READ_LAYER = Symbol('UserActivityReadLayer');
