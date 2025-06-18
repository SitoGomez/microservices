import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';

import {
  COMMAND_BUS,
  ICommandBus,
} from '../../../../../shared/commandBus/ICommandBus';
import { RegisterUserCommand } from '../../../application/RegisterUser/RegisterUser.command';

import { RegisterUserControllerDto } from './RegisterUserController.dto';

@Controller()
export class RegisterUserController {
  public constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
  ) {}

  @Post('/users/register')
  @HttpCode(HttpStatus.CREATED)
  public async handle(@Body() body: RegisterUserControllerDto): Promise<void> {
    const command = new RegisterUserCommand(
      body.userId,
      body.email,
      body.password,
    );

    return this.commandBus.execute(command);
  }
}
