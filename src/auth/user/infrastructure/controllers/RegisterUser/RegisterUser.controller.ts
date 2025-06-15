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
import { RegisterUserCommand } from '../../../application/RegisterUser/RegisterUser.command';

import { RegisterUserControllerDto } from './RegisterUserController.dto';

@Controller()
export class RegisterUserController {
  public constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
  ) {}

  @Post('/api/users/register')
  public async handle(
    @Body() body: RegisterUserControllerDto,
    @Res() res: Response,
  ): Promise<void> {
    const command = new RegisterUserCommand(
      body.userId,
      body.email,
      body.password,
    );

    await this.commandBus.execute(command);

    res.status(HttpStatus.CREATED).send();
  }
}
