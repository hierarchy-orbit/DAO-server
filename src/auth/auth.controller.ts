 /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const token = await this.authService.signin(req);
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
  @Post('/numio')
  async loginWithNumio(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.loginWithNumio(req);
      res.status(200).send({
        responseCode: 200,
        result: user,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }
  @Post('/metamask')
  async loginWithMetaMask(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.loginWithMetaMask(req);
      res.status(200).send({
        responseCode: 200,
        result: user,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }
}
