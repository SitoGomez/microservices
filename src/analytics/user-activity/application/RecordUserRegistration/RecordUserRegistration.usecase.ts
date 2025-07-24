import { Inject } from '@nestjs/common';

import { ICommandHandler } from '../../../../shared/commandBus/ICommandHandler';
import {
  IUserActivityReadLayer,
  USER_ACTIVITY_READ_LAYER,
} from '../IUserActivityReadLayer';

import { RecordUserRegistrationCommand } from './RecordUserRegistrationCommand';

export class RecordUserRegistrationUseCase
  implements ICommandHandler<RecordUserRegistrationCommand, void>
{
  private readonly userActivityReadLayer: IUserActivityReadLayer;

  public constructor(
    @Inject(USER_ACTIVITY_READ_LAYER)
    userActivityReadLayer: IUserActivityReadLayer,
  ) {
    this.userActivityReadLayer = userActivityReadLayer;
  }

  public execute(command: RecordUserRegistrationCommand): Promise<void> {
    return this.userActivityReadLayer.saveUserRegistration(
      command.userId,
      command.email,
      command.createdAt,
    );
  }
}
