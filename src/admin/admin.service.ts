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
      console.log('In attributes')
      const Attributes = await this.DAOAttributesModel.find().exec();
      if (Attributes.length !== 0) {
        return Attributes[0];
      } else {
        throw { statusCode: 404, message: 'No attributes found!' };
      }
    } catch (err) {
      console.log('Here')
      throw err;
    }
  }
  async updateAttributes(req) {
    try {
      const user = await this.userModel.findById(req.params.id).exec();
      if (!user) {
        throw { statusCode: 404, message: 'No user found!' };
      }
      if (!user.isAdmin) {
        throw { statusCode: 403, message: 'Forbidden! admin resource!' };
      }

      if (
        !req.body.minimumUpvotes ||
        !req.body.monthlyBudget ||
        !req.body.maxUpvoteDays
      ) {
        throw { statusCode: 400, message: 'Data validation error!' };
      }
      const updateAttributes = await this.DAOAttributesModel.findByIdAndUpdate(
        process.env.Attributes_DOC_ID,
        {
          $set: {
            minimumUpvotes: req.body.minimumUpvotes,
            monthlyBudget: req.body.monthlyBudget,
            maxUpvoteDays: req.body.maxUpvoteDays,
          },
        },
        { new: true },
      );
      return updateAttributes;
    } catch (err) {
      throw err;
    }
  }
  async getAllPendingMilestones() {
    try {
      const milestones = [];
      const proposals = await this.proposalModel.find().exec();
      for (let i = 0; i < proposals.length; i++) {
        for (let j = 0; j < proposals[i].milestone.length; j++) {
          if (proposals[i].milestone[j].status == 'Pending') {
            milestones.push(proposals[i].milestone[j]);
          }
        }
      }
      if (milestones.length !== 0) {
        return milestones;
      } else {
        throw { statusCode: 404, message: 'No pending milestones found!' };
      }
    } catch (error) {
      throw error;
    }
  }
}
