/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Req, Res, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request, Response } from 'express';

@Controller('DAOadminAttributes')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Here we get all the adminAttributes
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
  // Here we update adminAttiributes
  @Put('/:id')
  async updateAttributes(@Req() req: Request, @Res() res: Response) {
    try {
      const updatedAttributes = await this.adminService.updateAttributes(req);
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
  // Here we get all milestones of all proposals which have status "Pending"
  @Get('/milestones')
  async getAllPendingMilestones(@Req() req: Request, @Res() res: Response) {
    try {
      const milestones = await this.adminService.getAllPendingMilestones();
      res.status(200).send({
        responseCode: 200,
        result: milestones,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }
}
