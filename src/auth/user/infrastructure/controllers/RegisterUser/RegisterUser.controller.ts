import { Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class RegisterUserController {
  @Post('/api/users/register')
  public handle(@Res() res: Response): void {
    res.status(HttpStatus.CREATED).send();
  }
}
