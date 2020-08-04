/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add')
  async addUser(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.userService.addUser(req.body);
      res.status(200).send({
        responseCode: 200,
        result: user,
      });
    } catch (error) {
      console.log('in catch');
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }

  @Get()
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).send({
        responseCode: 200,
        result: users,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }
}
