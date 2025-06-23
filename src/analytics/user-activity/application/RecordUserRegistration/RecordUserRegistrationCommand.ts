import { BaseCommand } from '../../../../shared/commandBus/BaseCommand';

export class RecordUserRegistrationCommand extends BaseCommand {
  public constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly createdAt: Date,
  ) {
    super();
  }
}
