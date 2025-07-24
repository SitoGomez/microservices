import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Headers,
} from '@nestjs/common';

import {
  COMMAND_BUS,
  ICommandBus,
} from '../../../../../shared/commandBus/ICommandBus';
import { RegisterUserCommand } from '../../../application/RegisterUser/RegisterUser.command';

import { RegisterUserControllerDto } from './RegisterUserController.dto';

@Controller()
export class RegisterUserController {
  private readonly commandBus: ICommandBus;

  public constructor(@Inject(COMMAND_BUS) commandBus: ICommandBus) {
    this.commandBus = commandBus;
  }

  @Post('/users/register')
  @HttpCode(HttpStatus.CREATED)
  public async handle(
    @Headers('x-request-id') requestId: string,
    @Body() body: RegisterUserControllerDto,
  ): Promise<void> {
    const command = new RegisterUserCommand(
      requestId,
      body.userId,
      body.email,
      body.password,
    );

    return this.commandBus.execute(command);
  }
}
