/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { StakeService } from './stake.service';
import { Request, Response } from 'express';

@Controller('stake')
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}

  // Here user adds a stake on a proposal
  @Post('/:id')
  async addStake(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.stakeService.addStake(req, res);
      res.status(200).send({
        responseCode: 200,
        result: result,
      });
    } catch (error) {
      res.status(400).send({
        responseCode: 400,
        result: error.message,
      });
    }
  }
  // Here we get all stakes on all proposals
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
  // Here we get a stake on a proposal by Id
  @Get('/:id')
  async getStakeById(@Req() req: Request, @Res() res: Response) {
    try {
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
