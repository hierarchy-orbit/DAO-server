/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DAOAttributes } from './admin.model';
import { User } from '../user/user.model';
import { Proposal } from '../proposal/proposal.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('DAOAttributes')
    private readonly DAOAttributesModel: Model<DAOAttributes>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('Proposal')
    private readonly proposalModel: Model<Proposal>,
  ) {}

  async getAttributes(): Promise<DAOAttributes[]> {
    try {
      const Attributes = await this.DAOAttributesModel.find().exec();
      if (Attributes.length !== 0) {
        return Attributes[0];
      } else {
        throw { statusCode: 404, message: 'No attributes found!' };
      }
    } catch (error) {
      console.log(error);
    }
  }
}
