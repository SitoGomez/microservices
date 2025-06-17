import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
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

  @Post('/api/users/login')
  public async handle(
    @Body() body: LoginUserControllerDto,
    @Res() res: Response,
  ): Promise<void> {
    const command = new LoginUserCommand(body.email, body.password);

    await this.commandBus.execute(command);

    res.status(HttpStatus.OK).send();
  }
}
