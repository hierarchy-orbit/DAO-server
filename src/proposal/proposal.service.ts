/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal } from './proposal.model';
import { User } from '../user/user.model';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { async } from 'rxjs/internal/scheduler/async';
import { DAOAttributes } from '../admin/admin.model';
import { EDESTADDRREQ } from 'constants';
import { NodemailerService } from '../nodemailer/nodemailer.service';
//import Web3 from 'web3'
import {
  PHNX_PROPOSAL_ABI,
  PHNX_PROPOSAL_ADDRESS,
} from '../contracts/contracts';
import axios from 'axios';

// const fs = require('fs')
// const axios = require('axios');
const Web3 = require('web3');
const moment = require('moment');
// let parsed = JSON.parse(fs.readFileSync(PHNX_PROPOSAL_ABI))
// let abi = parsed.abi

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('DAOAttributes')
    private readonly DAOAttributesModel: Model<DAOAttributes>,
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
    private readonly NodemailerService: NodemailerService,
  ) {}

  getAllProposals = async () => {
    console.log('Working here');
    try {
      let proposals = await this.proposalModel.find();
      let serverDate = moment(Date.now()).format();
      for (let i = 0; i < proposals.length; i++) {
        if (
          proposals[i].status == 'UpVote' &&
          moment(proposals[i].expirationDate).format() < serverDate
        ) {
          await this.proposalModel.findByIdAndUpdate(
            proposals[i]._id,
            {
              $set: { status: 'Rejected' },
            },
            { runValidators: true, new: true },
          );
        }
      }
      proposals = await this.proposalModel.find();

      if (proposals.length !== 0) {
        return proposals;
      } else {
        throw 'No proposal found';
      }
    } catch (err) {
      throw err;
    }
  };

  postProposal = async (req, res) => {
    console.log('In post proposal here 123');
    let serverDate = moment(Date.now()).format();
    console.log('Server Date =======>>', serverDate);
    try {
      const user = await this.userService.getUserById(req.numioAddress);
      if (!user) {
        throw { statusCode: 404, message: 'User not found' };
      }
      const statusTest = 'Incomplete';
      for (let i = 0; i < req.milestone.length; i++) {
        req.milestone[i].status = statusTest;
      }
      const Attributes = await this.DAOAttributesModel.find().exec();
      if (Attributes.length == 0) {
        throw { statusCode: 404, message: 'No attributes found!' };
      }
      const data = {
        ...req,
        minimumUpvotes: Attributes[0].minimumUpvotes,
      };
      const createdProposal = await this.proposalModel.create(data);
      if (!createdProposal) {
        throw { statusCode: 404, message: 'Proposal not created' };
      }

      return createdProposal;
    } catch (err) {
      throw err.message;
    }
  };

  getProposalsById = async id => {
    try {
      const result = await this.proposalModel.findById(id);
      console.log('Get proposal by ID', result);

      return result;
    } catch (err) {
      throw 'No Proposal Found';
    }
  };
  updateProposalStatus = async (id, req) => {
    console.log('In update proposal status', req.body);

    // console.log('REQ ----->',id,req)
    // console.log('REQ ---->',req.body)
    //  console.log(1)
    //  const {status, reasonForRejecting} = req.body;
    //  console.log(2)
    try {
      if (req.body.status == 'Rejected') {
        const emailResult = await this.NodemailerService.sendEmail(
          req,
          'proposalRejection',
        );

        console.log('Email', emailResult);
        console.log(3);
      }
      let Attributes = [];
      const proposal = await this.proposalModel.findById(id);
      console.log('proposal', proposal);
      // throw 'abc'
      //  if(proposal.status == 'UpVote' || proposal.status =='Rejected' && req.body.stage == 1 ) {
      //   console.log('In if stage wrong', req.body.stage)
      //   throw { statusCode: 500, message: 'Proposal already changed'}
      // }
      if (!proposal) {
        console.log(5);
        throw { statusCode: 404, message: 'Proposal Not Found' };
      }
      console.log('AAAAA');
      if (req.body.status === 'UpVote') {
        console.log(989);
        Attributes = await this.DAOAttributesModel.find().exec();
        if (Attributes.length == 0) {
          console.log(7);
          throw { statusCode: 404, message: 'No attributes found!' };
        }
        //   console.log('BBBBB')
        const expirationDate = moment()
          .add(Attributes[0].maxUpvoteDays, 'd')
          .format('YYYY-MM-DD');
        //   console.group('CCCCCC')
        const result = await this.proposalModel.findByIdAndUpdate(
          id,
          {
            $set: { status: req.body.status, expirationDate: expirationDate },
          },
          { runValidators: true, new: true },
        );
        console.log(8);
        return result;
      } else if (req.body.status === 'Accepted') {
        console.log(9);
        let completionDays = 0,
          estCompletionDate;
        for (let t = 0; t < proposal.milestone.length; t++) {
          completionDays += Number(proposal.milestone[t].days);
        }
        estCompletionDate = moment(Date.now())
          .add(completionDays, 'days')
          .format();
        console.log(10);
        const result = await this.proposalModel.findByIdAndUpdate(
          id,
          {
            $set: { status: 'Accepted', estCompletionDate },
          },
          { runValidators: true, new: true },
        );
        return result;
      }
      console.log('DDDD');

      const result = await this.proposalModel.findByIdAndUpdate(
        id,
        {
          $set: { status: req.body.status },
        },
        { runValidators: true, new: true },
      );
      console.log(11);
      return result;
    } catch (err) {
      console.log('----////// error here', err);
      throw err;
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
  getProposalByNumioAddressAndProposalStatus = async (numioAddress, status) => {
    try {
      const result = await this.proposalModel.find({
        numioAddress: numioAddress,
        status: status,
      });
      if (result.length == 0) {
        throw { statusCode: 404, message: 'Not Proposal Found' };
      }
      return result;
    } catch (err) {
      throw { status: 400, message: err.message };
    }
  };

  getCurrentGasPrices = async () => {
    try {
      let response = await axios.get(
        'https://ethgasstation.info/json/ethgasAPI.json',
      );
      let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10,
      };
      console.log(prices);
      return prices;
    } catch (e) {
      console.log(e);
    }
  };

  // Blockchain Function

  updateStatus = async (id, status) => {
    console.log('Address ====>', PHNX_PROPOSAL_ADDRESS);
    console.log('ID', id);
    //console.log('++++++++++++++++++++',PHNX_PROPOSAL_ABI)
    console.log('Update status from blockchain');
    const web3 = new Web3(
      'https://rinkeby.infura.io/v3/98ae0677533f424ca639d5abb8ead4e7',
    );

    const contract = new web3.eth.Contract(
      PHNX_PROPOSAL_ABI,
      '0x5579fBfD5417758Bf276276aFb597b7C6b30786E',
    );
    try {
      let count = await web3.eth.getTransactionCount(
        '0x51a73C48c8A9Ef78323ae8dc0bc1908A1C49b6c6',
        'pending',
      );
      let gasPrices = await this.getCurrentGasPrices();
      console.log(gasPrices);
      console.log('Working');
      let rawTransaction = {
        from: '0x51a73C48c8A9Ef78323ae8dc0bc1908A1C49b6c6',
        to: '0x5579fBfD5417758Bf276276aFb597b7C6b30786E',
        data: contract.methods.updateProposalStatus(id, 2).encodeABI(),
        gasPrice: gasPrices.high * 1000000000,
        nonce: count,
        gasLimit: web3.utils.toHex(2000000),
      };
      let pr_key = process.env.adminPrivateKey;
      let signed = await web3.eth.accounts.signTransaction(
        rawTransaction,
        pr_key,
      );
      let tempStatus = { body: { status: 'Voting' } };
      console.log('Working');
      await web3.eth
        .sendSignedTransaction(signed.rawTransaction)
        .on('confirmation', async (confirmationNumber, receipt) => {
          if (confirmationNumber === 1) {
            console.log('receir', receipt);
            //    await this.updateProposalStatus(id, tempStatus);
            return true;
          }
        })
        .on('error', error => {
          console.log('error', error);
          return false;
        })
        .on('transactionHash', async hash => {
          console.log('transaction has -->', hash);
          return true;
        });

      return true;
    } catch (Err) {
      console.log(Err);
      return false;
    }
  };

  VoteOnProposal = async (req, res) => {
    //  console.log('Status',req)
    let blockChainResult;
    try {
      const proposal = await this.proposalModel.findById(req.params.id);
      //   console.log('Proposal', proposal.status)

      if (!proposal) {
        //   console.log('In if 1')
        throw { statusCode: 404, message: 'Proposal Not Found' };
      }

      if (proposal.status !== 'UpVote') {
        //    console.log('In if 2')
        throw { statusCode: 400, message: 'Proposal cannot be upvoted' };
      }
      let serverDate = moment(Date.now()).format();
      if (moment(proposal.expirationDate).format() < serverDate) {
        await this.proposalModel.findByIdAndUpdate(
          proposal._id,
          {
            $set: { status: 'Rejected' },
          },
          { runValidators: true, new: true },
        );

        console.log('In if three 3');
        throw {
          statusCode: 400,
          message: 'Proposal cannot be upvoted since it is expired',
        };
      }
      //  console.log('Hello')

      const checkUserExist = await this.userModel.find({
        email: req.body.email,
      });
      if (checkUserExist.length == 0) {
        console.log('In  if');
        //    console.log('In if 4')
        throw { statusCode: 400, message: 'User does not exist' };
      }
      const check = proposal.votes.some(el => {
        //Here is the name validation (A user cannot vote twice)
        if (el.email == req.body.email) {
          //  console.log('In if 5')
          throw { statusCode: 400, message: 'User cannot vote again' };
        }
      });

      const checkCount = await this.proposalModel.findById(req.params.id);

      const singleProposal = await this.proposalModel.findById(req.params.id);

      console.log('check count', checkCount.votes.length);
      console.log('single proposal', singleProposal.minimumUpvotes);

      if (checkCount.votes.length >= singleProposal.minimumUpvotes - 1) {
        //  console.log('In if checkCount', req.body)
        let tempStatus = { body: { status: 'Voting' } };
        console.log('ID here ----->', req.params.id);
        await this.updateStatus(req.params.id, 2)
          .then(async (Result: any) => {
            console.log('Result ---->', Result);
            if (Result) {
              console.log('In if ===================');
              await this.updateProposalStatus(req.params.id, tempStatus);
            } else {
              console.log('In else');
              throw { statusCode: 400, message: 'Transaction failed' };
            }
          })
          .catch(err => {
            console.log('In catch', err);
            throw { statusCode: 400, message: 'Transaction failed' };
          });
      }

      const result = await this.proposalModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            votes: { date: Date.now(), email: req.body.email },
          },
        },
        { runValidators: true, new: true },
      );

      console.log('Result email', result);

      const result2 = await this.userModel.findOneAndUpdate(
        { email: req.body.email },
        { $push: { proposalVote: result._id } },
      );

      console.log('Result 2', result2);

      const Attributes = await this.DAOAttributesModel.find().exec();
      if (Attributes.length == 0) {
        //     console.log('In if 6')
        //    console.log('Here')
        throw { statusCode: 404, message: 'No attributes found!' };
      }
      // if (checkCount.votes.length > result.minimumUpvotes - 1) {
      // //  console.log('In if checkCount', req.body)
      //   let tempStatus = { body:{status: 'Voting'} }
      //   console.log('ID here ----->', req.params.id)
      //   await this.updateStatus(req.params.id, 2)
      //  .then( async (Result: any) => { console.log('Result ---->',Result);
      //   if(Result){
      //     console.log('In if ===================')
      //    await this.updateProposalStatus(req.params.id, tempStatus)

      //   } else { console.log('In else');  throw { statusCode: 400, message: 'Transaction failed' };}  }  )
      //  .catch((err) => {console.log('In catch', err); throw { statusCode: 400, message: 'Transaction failed' };})
      let date = new Date();
      if (date.getDate() < 16) {
        date = moment(Date.now())
          .add(1, 'M')
          .format('YYYY-MM-02');
        console.log('Date ---->', date);
      } else {
        date = moment(Date.now())
          .add(2, 'M')
          .format('YYYY-MM-02');
        console.log('Date ---->', date);
      }
      // console.log('============================', date)
      // console.log('Set Month above', req.params.id)

      const setMonth = await this.proposalModel.findByIdAndUpdate(
        req.params.id,
        { $set: { votingDate: date } },
      );

      //   console.log('Set month Below')
      const tempX = await this.proposalModel.findById(req.params.id);
      //   console.log(tempX)

      console.log('Success');
      console.log('Blockchain result', blockChainResult);
      return 'Success';
    } catch (err) {
      console.log('check error now', err);
      throw { statusCode: 400, message: err.message };
    }
  };

  getProposalsByStatus = async req => {
    try {
      let proposals = await this.proposalModel.find({
        status: req.body.status,
      });

      if (!proposals || proposals?.length == 0) {
        throw { statusCode: 404, message: 'No Proposal Found' };
      }
      if (req.body.status == 'UpVote') {
        let serverDate = moment(Date.now()).format();

        for (let i = 0; i < proposals.length; i++) {
          if (moment(proposals[i].expirationDate).format() < serverDate) {
            await this.proposalModel.findByIdAndUpdate(
              proposals[i]._id,
              {
                $set: { status: 'Rejected' },
              },
              { runValidators: true, new: true },
            );
          }
        }
        proposals = await this.proposalModel.find({ status: req.body.status });
      }
      return proposals;
    } catch (err) {
      throw err;
    }
  };
  changeStatusOfMilestoneByAdmin = async (req, res) => {
    console.log('Proposal', req.body);
    try {
      if (!req.params.id) {
        throw {
          statusCode: 400,
          message: 'Please provide proposal id in params',
        };
      }

      const result = await this.proposalModel.findById(req.params.id);
      if (req.body.index > result.milestone.length) {
        throw {
          statusCode: 400,
          message: 'Index must not be greater then the total milestones',
        };
      }
      if (result.status != 'Accepted') {
        throw { statusCode: 400, message: 'Invalid Status' };
      }
      if (!result) {
        throw { statusCode: 404, message: 'Proposal not found!' };
      }
      if (!req.body.numioAddress) {
        throw { statusCode: 400, message: 'Must Provide Numio Address' };
      }
      const user = await this.userModel.findOne({
        numioAddress: req.body.numioAddress,
      });
      if (!user) {
        throw { statusCode: 400, message: 'User not found' };
      }
      if (user.isAdmin == false) {
        throw { statusCode: 400, message: 'User must be the admin' };
      }
      if (user.isAdmin) {
        result.milestone[req.body.index].status = req.body.status;
        result.markModified('milestone');
        result.save();

        const emailResult = await this.NodemailerService.sendEmail(
          req,
          'milestoneRejection',
        );
        console.log('Email sent', emailResult);
      }
      return result;
    } catch (err) {
      console.log('Error --->', err.message);
      throw { statusCode: 400, message: err.message };
    }
  };

  changeStatusOfMilestoneByUser = async (req, res) => {
    try {
      if (!req.params.id) {
        throw {
          statusCode: 400,
          message: 'Please provide proposal id in params',
        };
      }
      const result = await this.proposalModel.findById(req.params.id);

      if (!result) {
        throw { statusCode: 404, message: 'Proposal not found!' };
      }
      if (result.status != 'Accepted') {
        throw { statusCode: 400, message: 'Invalid Status' };
      }
      if (req.body.index > result.milestone.length) {
        throw {
          statusCode: 400,
          message: 'Index must not be greater then the total milestones',
        };
      }

      if (!req.body.numioAddress) {
        throw { statusCode: 400, message: 'Must Provide Numio Address' };
      }
      const user = await this.userModel.findOne({
        numioAddress: req.body.numioAddress,
      });
      if (!user) {
        throw { statusCode: 400, message: 'User not found' };
      }
      if (result.numioAddress != user.numioAddress) {
        throw { statusCode: 400, message: 'Invalid User, user must be same' };
      }
      if (req.body.status == 'Completed') {
        result.milestone[req.body.index].status = 'Pending';
      } else if (req.body.status == 'Incomplete') {
        result.milestone[req.body.index] = 'Incomplete';
      }

      result.markModified('milestone');
      result.save();

      return result;
    } catch (err) {
      throw { statusCode: 400, message: err.message };
    }
  };

  updateProposalEstCompleteDateAndGitHubLink = async req => {
    try {
      const proposal = await this.proposalModel.findById(req.params.id);
      if (!proposal) {
        throw { statusCode: 404, message: 'Proposal not found!' };
      }
      const user = await this.userModel.findOne({
        numioAddress: req.body.numioAddress,
      });
      if (!user) {
        throw {
          statusCode: 404,
          message: 'User with provided numioAddress doesnot exist',
        };
      }
      if (user.numioAddress != proposal.numioAddress) {
        throw { statusCode: 401, message: 'Unauthorized!' };
      }
      const updateProposal = await this.proposalModel.findByIdAndUpdate(
        proposal._id,
        {
          githubLink: req.body.githubLink,
          estCompletionDate: req.body.estCompletionDate,
        },
        { runValidators: true, new: true },
      );
      return updateProposal;
    } catch (err) {
      throw { message: err.message, statusCode: 400 };
    }
  };

  updateProposal = async req => {
    try {
      const proposal = await this.proposalModel.findById(req.params.id);
      if (!proposal) {
        throw { statusCode: 404, message: 'Proposal not found!' };
      }
      if (
        proposal.status != 'Pending' ||
        proposal.status != 'Fail' ||
        proposal.status != 'Rejected'
      ) {
        throw {
          statusCode: 400,
          message: 'Proposal can not be updated !',
        };
      }
      const user = await this.userModel.findOne({
        numioAddress: req.body.numioAddress,
      });
      if (!user) {
        throw {
          statusCode: 404,
          message: 'User with provided numioAddress does not exist',
        };
      }
      if (user.numioAddress != proposal.numioAddress) {
        throw { statusCode: 401, message: 'Unauthorized!' };
      }
      console.log('req.body is ', req.body);
      const updateProposal = await this.proposalModel.findByIdAndUpdate(
        proposal._id,
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          name: req.body.name,
          country: req.body.country,
          email: req.body.email,
          description: req.body.description,
          githubLink: req.body.githubLink,
          budget: req.body.budget,
          purpose: req.body.purpose,
          importance: req.body.importance,
          // fundsUsage: req.body.fundsUsage,
          // personalExperience: req.body.personalExperience,
          experiencedYear: req.body.experiencedYear,
          duration: req.body.duration,
          collateral: req.body.collateral,
          // reward: req.body.reward,
          numioAddress: req.body.numioAddress,
          milestone: req.body.milestone,
        },
        { runValidators: true, new: true },
      );
      console.log('updated', updateProposal);
      return updateProposal;
    } catch (err) {
      throw err;
    }
  };

  deleteProposal = async req => {
    try {
      const proposal = await this.proposalModel.findById(req.params.id);
      if (!proposal) {
        throw { statusCode: 404, message: 'Proposal not found!' };
      }
      if (
        proposal.status != 'Pending' &&
        proposal.status != 'InTransaction' &&
        proposal.status != 'Rejected'
      ) {
        throw {
          statusCode: 400,
          message: 'Proposal can not be deleted !',
        };
      }
      const user = await this.userModel.findOne({
        numioAddress: req.body.numioAddress,
      });
      if (!user) {
        throw {
          statusCode: 404,
          message: 'User with provided numioAddress does not exist',
        };
      }
      if (user.numioAddress != proposal.numioAddress) {
        throw { statusCode: 401, message: 'Unauthorized!' };
      }
      const deletedProposal = await this.proposalModel.findOneAndDelete({
        _id: proposal._id,
      });
      return deletedProposal;
    } catch (err) {
      throw err;
    }
  };

  sendMail = async req => {
    try {
      const emailResult = await this.NodemailerService.sendTestMail(req);
      return;
    } catch (err) {
      throw err;
    }
  };
}
