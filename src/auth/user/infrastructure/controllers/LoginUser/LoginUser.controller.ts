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
import { LoginUserResponse } from '../../../application/LoginUser/LoginUserResponse.type';

import { LoginUserControllerInputDto } from './LoginUserControllerInput.dto';
import { LoginUserControllerOutputDto } from './LoginUserControllerOutput.dto';

@Controller()
export class LoginUserController {
  public constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
  ) {}

  @Post('/users/login')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @Headers('x-request-id') requestId: string,
    @Body() body: LoginUserControllerInputDto,
  ): Promise<LoginUserControllerOutputDto> {
    const command = new LoginUserCommand(requestId, body.email, body.password);

    const commandResult = await this.commandBus.execute<
      LoginUserCommand,
      LoginUserResponse
    >(command);

    return new LoginUserControllerOutputDto(commandResult.access_token);
  }
}
