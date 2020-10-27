/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stake } from './stake.model';
import { ProposalService } from '../proposal/proposal.service';
import { TransactionService } from '../transaction/transaction.service';
import { User } from 'src/user/user.model';
import { Proposal } from 'src/proposal/proposal.model';

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly proposalService: ProposalService,
    private readonly transactionService: TransactionService,
  ) {}
  async addStake(req) {
    try {
      const user = req.body.user;
      const proposalId = req.params.id;
      const amount = req.body.amount;
      const days = req.body.days;
      const reward = req.body.reward;
      const TxHash = req.body.TxHash;

      // USER MUST EXIST

      if (!user) {
        throw { statusCode: 400, message: 'User does not exist' };
      }
      const userExist = await this.userModel.findOne({
        email: user.email,
      });
      if (!userExist) {
        throw { statusCode: 400, message: 'User does not exist' };
      }

      // PROPOSAL ID MUST BE VALID

      if (!proposalId) {
        throw { message: 'Please please provide proposalId in params!' };
      }

      // PROPOSAL MUST EXIST

      const proposal = await this.proposalService.getProposalsById(proposalId);
      if (!proposal) {
        throw {
          statusCode: 404,
          message: 'Proposal not found on the id provided!',
        };
      }

      // PROPOSAL STATUS MUST BE VOTING

      if (proposal.status !== 'Voting') {
        throw {
          statusCode: 400,
          message: 'Proposal is not avaiable for staking!',
        };
      }

      // USER SHOULD NOT STAKE TWICE

      proposal.stake.some(el => {
        if (el.email == userExist.email) {
          throw {
            statusCode: 403,
            message: 'You cannot stake multiple times on a single proposal!',
          };
        }
      });

      // MUST PROVIDE AMOUNT AND DAYS

      if (!req.body.amount || !req.body.days) {
        throw {
          statusCode: 400,
          message: 'Please provide the amount and days correctly!',
        };
      }

      // CREATING STAKE DOCUMENT AND SAVING IN DATABASE

      const newStake = new this.stakeModel({
        amount,
        TxHash,
        days,
        proposalId,
        reward,
      });
      const createdStake = await this.stakeModel.create(newStake);

      // IF STAKE NOT CREATED

      if (!createdStake) {
        throw { statusCode: 400, message: 'Cannot Stake' };
      }

      // CREATING TRANSACTION DOCUMENT AND SAVING IN DATABASE

      const createdTransaction = await this.transactionService.createTransaction(
        TxHash,
        'Stake',
        userExist.numioAddress,
        createdStake._id,
      );

      // UPDATING THE PROPOSAL DOCUMENT IN DATABASE
      const newReward = amount + proposal.reward;
      const updatedProposal = await this.proposalModel
        .findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              stake: { date: Date.now(), email: userExist.email },
            },
            reward: newReward,
          },
          { new: true },
        )
        .exec();

      // UPDATING THE USER DOCUMENT IN DATABASE

      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { email: userExist.email },
          { $push: { proposalStake: updatedProposal._id } },
          { new: true },
        )
        .exec();

      return { updatedUser: updatedUser, updatedProposal: updatedProposal };
    } catch (error) {
      throw error;
    }
  }
  async getAllStakes(): Promise<Stake[]> {
    try {
      const stakes = await this.stakeModel
        .find()
        .populate('proposalId')
        .exec();
      if (stakes.length == 0) {
        throw { statusCode: 404, message: 'No stake found!' };
      } else {
        return stakes;
      }
    } catch (error) {
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
