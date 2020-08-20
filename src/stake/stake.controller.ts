/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { StakeService } from './stake.service';
import { Request, Response } from 'express';

@Controller('stake')
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}
  @Post('/:id')
  async addStake(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.stakeService.addStake(req, res);
      console.log('in try');
      res.status(200).send({
        responseCode: 200,
        result: result,
      });
    } catch (error) {
      console.log('in catch');
      res.status(400).send({
        responseCode: 400,
        result: error.message,
      });
    }
  }

  @Get('/')
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
