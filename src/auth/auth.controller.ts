import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const token = await this.authService.signin(req, res);
      res.status(200).send({
        responseCode: 200,
        result: token,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }
}
