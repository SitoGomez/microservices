import { randomUUID } from 'crypto';

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
import { LoginUserCommand } from '../../../application/LoginUser/LoginUser.command';

import { LoginUserControllerDto } from './LoginUserController.dto';

@Controller()
export class LoginUserController {
  public constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
  ) {}

  @Post('/users/login')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @Body() body: LoginUserControllerDto,
  ): Promise<{ access_token: string }> {
    const command = new LoginUserCommand(
      randomUUID(),
      body.email,
      body.password,
    );

    return this.commandBus.execute(command);
  }
}
