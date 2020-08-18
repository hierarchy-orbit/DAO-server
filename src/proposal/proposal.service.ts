/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Proposal } from './proposal.model';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { BlockChainFunctions } from '../web3';
import { DAOAttributes } from '../admin/admin.model';
import { TransactionService } from '../transaction/transaction.service';
const moment = require('moment');

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
    @InjectModel('DAOAttributes')
    private readonly userService: UserService,
    private readonly DAOAttributesModel: Model<DAOAttributes>,
    private readonly transactionService: TransactionService,
  ) {}
  getAllProposals = async () => {
    try {
      const result = await this.proposalModel.find();
      if (result.length !== 0) {
        return result;
      } else {
        throw 'No proposal found';
      }
    } catch (err) {
      throw err;
    }
  };

  postProposal = async (req, res) => {
    try {
      console.log(req.numioAddress);
      const user = await this.userService.getUserById(req.numioAddress);

      if (!user) {
        throw { statusCode: 404, message: 'User not found' };
      }

      const BCF = new BlockChainFunctions();
      const TxHash = await BCF.getTxHash();

      if (!TxHash) {
        throw {
          statusCode: 400,
          message: 'Empty transaction Hash from server!',
        };
      }
      const status = 'Incomplete';
      for (let i = 0; i < req.milestone.length; i++) {
        req.milestone[i].status = status;
      }
      const Attributes = await this.DAOAttributesModel.find().exec();
      console.log('Attributes', Attributes.length);
      if (Attributes.length == 0) {
        throw { statusCode: 404, message: 'No attributes found!' };
      }
      let expirationDate = moment()
        .add(Attributes[0].maxUpvoteDays, 'd')
        .format('YYYY-MM-DD');
      console.log('expirationDate ==>', expirationDate);
      const data = {
        ...req,
        minimumUpvotes: Attributes[0].minimumUpvotes,
        expirationDate: expirationDate,
      };
      console.log('Data ', data);

      const createdProposal = await this.proposalModel.create(data);
      console.log('Created Proposal', createdProposal);
      if (!createdProposal) {
        throw { statusCode: 404, message: 'Proposal not created' };
      }
      const createdTransaction = await this.transactionService.createTransaction(
        TxHash,
        'Proposal',
        user.numioAddress,
        createdProposal._id,
      );
      console.log('Transaction', createdTransaction);
      return { createdProposal, createdTransaction };
    } catch (err) {
      throw err.message;
    }
  };

  getProposalsById = async id => {
    try {
      const result = await this.proposalModel.findById(id);

      return result;
    } catch (err) {
      // console.log(err);
      throw 'No Proposal Found';
    }
  };

  getProposalByNumioAddress = async numioAddress => {
    try {
      const result = await this.proposalModel.find({
        numioAddress: numioAddress,
      });
      if (result.length == 0) {
        throw { statusCode: 404, message: 'Not Proposal Found' };
      }
      return result;
    } catch (err) {
      throw { status: 400, message: err.message };
    }
  };

  getProposalsByStatus = async req => {
    try {
      //console.log('Status ===>>>>', status);
      const result = await this.proposalModel.find({ status: req.body.status });
      return result;
    } catch (err) {
      throw err;
    }
  };
}
