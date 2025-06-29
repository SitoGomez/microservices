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
    @Headers('x-request-id') requestId: string,
    @Body() body: LoginUserControllerDto,
  ): Promise<{ access_token: string }> {
    const command = new LoginUserCommand(requestId, body.email, body.password);

    return this.commandBus.execute(command);
  }
}
