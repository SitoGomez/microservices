import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Response } from 'express';

import {
  COMMAND_BUS,
  ICommandBus,
} from '../../../../../shared/commandBus/ICommandBus';
import { LoginUserCommand } from '../../../application/LoginUser/LoginUser.command';

import { LoginUserControllerDto } from './LoginUserController.dto';

@Controller()
export class LoginUserController {
  public constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
  ) {}

  @Post('/users/login')
  public async handle(
    @Body() body: LoginUserControllerDto,
  ): Promise<{ access_token: string }> {
    const command = new LoginUserCommand(body.email, body.password);

    return this.commandBus.execute(command);
  }
}
