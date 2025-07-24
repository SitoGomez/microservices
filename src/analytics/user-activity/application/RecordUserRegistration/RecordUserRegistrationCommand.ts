import { BaseCommand } from '../../../../shared/commandBus/BaseCommand';

export class RecordUserRegistrationCommand extends BaseCommand {
  public readonly userId: string;
  public readonly email: string;
  public readonly createdAt: Date;

  public constructor(
    id: string,
    userId: string,
    email: string,
    createdAt: Date,
  ) {
    super(id);

    this.userId = userId;
    this.email = email;
    this.createdAt = createdAt;
  }
}
