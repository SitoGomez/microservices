import { ICommandHandler } from '../../../../shared/commandBus/ICommandHandler';

import { RecordUserRegistrationCommand } from './RecordUserRegistrationCommand';

export class RecordUserRegistrationUseCase
  implements ICommandHandler<RecordUserRegistrationCommand, void>
{
  public execute(command: RecordUserRegistrationCommand): Promise<void> {
    console.table(command);
    return Promise.resolve();
  }
}
