/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { StakeService } from './stake.service';
import { Request, Response } from 'express';

@Controller('stake')
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}
  @Post('/:id')
  async getAllStakes(@Req() req: Request, @Res() res: Response) {
    try {
      const stakes = await this.stakeService.getAllStakes();
      res.status(200).send({
        responseCode: 200,
        result: stakes,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }
  @Get('/:id')
  async getStakeById(@Req() req: Request, @Res() res: Response) {
    try {
      //console.log(req.params.id)
      const stake = await this.stakeService.getStakeById(req.params.id);
      res.status(200).send({
        responseCode: 200,
        result: stake,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }
}
