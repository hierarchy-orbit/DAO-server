/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    Controller,
    Get,
    Req,
    Res,
    Put,
  } from '@nestjs/common';
  import { AdminService } from './admin.service';
  import { Request, Response } from 'express';
  
  @Controller('DAOadminAttributes')
  export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    async getAttributes(@Req() req: Request, @Res() res: Response) {
      try {
        const attributes = await this.adminService.getAttributes();
        res.status(200).send({
          responseCode: 200,
          result: attributes,
        });
      } catch (error) {
        res.status(error.statusCode).send({
          responseCode: error.statusCode,
          result: error.message,
        });
      }
    }
    @Put('/:id')
  async updateAttributes(@Req() req: Request, @Res() res: Response) {
    try {
      const updatedAttributes = await this.adminService.updateAttributes(
        req,
        res,
      );
      res.status(200).send({
        responseCode: 200,
        result: updatedAttributes,
      });
    } catch (err) {
      res.status(err.statusCode).send({
        responseCode: err.statusCode,
        result: err.message,
      });
    }
  }
}