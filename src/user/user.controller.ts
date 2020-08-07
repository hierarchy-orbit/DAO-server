/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Here we add a new user to database
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
  // Here we get all users
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
  // Here we get user by providing email
  @Get('/byEmail')
  async getUserByEmail(@Req() req: Request, @Res() res: Response) {
    try {
      console.log(req.body);
      const user = await this.userService.getUserByEmail(req.body.email);
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
  // Here we get user by providing numio address
  @Get('/:id')
  async getUserById(@Req() req: Request, @Res() res: Response) {
    try {
      //console.log(req.params.id)
      const user = await this.userService.getUserById(req.params.id);
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


