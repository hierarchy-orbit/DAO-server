/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stake } from './stake.model';

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
  ) {}

  async getAllStakes() {
    try {
      const stakes = await this.stakeModel.find().exec();
      if (stakes.length == 0) {
        throw { statusCode: 404, message: 'No stake found!' };
      } else {
        return stakes;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getStakeById(id) {
    try {
      const stake = await this.findStake(id);
      if (stake) {
        return stake;
      } else {
        throw { statusCode: 404, message: 'Stake not found' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  private async findStake(id: string) {
    let stake;
    try {
      stake = await this.stakeModel.findById(id).exec();
      return stake;
    } catch (error) {
      throw error;
    }
  }
}
