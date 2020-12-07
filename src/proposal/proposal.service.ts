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
import { NodemailerService } from '../nodemailer/nodemailer.service'

const axios = require('axios');
const moment = require('moment');

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('DAOAttributes')
    private readonly DAOAttributesModel: Model<DAOAttributes>,
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
    private readonly NodemailerService: NodemailerService
  ) {}

  getAllProposals = async () => {
    console.log('Working here')
    try {
      console.log('Working here')
      let proposals = await this.proposalModel.find();
      let serverDate= moment(Date.now()).format();
      for(let i=0 ; i < proposals.length; i++){

        if(proposals[i].status == "UpVote" && moment(proposals[i].expirationDate).format() < serverDate){
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

      return result;
    } catch (err) {
      throw 'No Proposal Found';
    }
  };
  updateProposalStatus = async (id, req) => {
    const {status, reasonForRejecting} = req.body;
    if(status == 'Rejected'){
      const emailResult = await this.NodemailerService.sendEmail(req);
    }
    try {
      let Attributes = [];
      const proposal = await this.proposalModel.findById(id);

      if (!proposal) {
        throw { statusCode: 404, message: 'Proposal Not Found' };
      }
      if (status === 'UpVote') {
        Attributes = await this.DAOAttributesModel.find().exec();
        if (Attributes.length == 0) {
          throw { statusCode: 404, message: 'No attributes found!' };
        }
        const expirationDate = moment()
          .add(Attributes[0].maxUpvoteDays, 'd')
          .format('YYYY-MM-DD');

        const result = await this.proposalModel.findByIdAndUpdate(
          id,
          {
            $set: { status: status, expirationDate: expirationDate },
          },
          { runValidators: true, new: true },
        );
        return result;
      } else if (status === 'Accepted') {
        let completionDays = 0,
          estCompletionDate;
        for (let t = 0; t < proposal.milestone.length; t++) {
          completionDays += Number(proposal.milestone[t].days);
        }
        estCompletionDate = moment(Date.now())
          .add(completionDays, 'days')
          .format();
        const result = await this.proposalModel.findByIdAndUpdate(
          id,
          {
            $set: { status: 'Accepted', estCompletionDate },
          },
          { runValidators: true, new: true },
        );
        return result;
      }

      const result = await this.proposalModel.findByIdAndUpdate(
        id,
        {
          $set: { status: status },
        },
        { runValidators: true, new: true },
      );
      return result;
    } catch (err) {
      throw 'Error';
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

  VoteOnProposal = async (req, res) => {
    console.log('Status',req.body.status)
    try {
      const proposal = await this.proposalModel.findById(req.params.id);
      console.log('Proposal', proposal.status)

      if (!proposal) {
        console.log('In if 1')
       throw { statusCode: 404, message: 'Proposal Not Found' };
      }

      if (proposal.status !== 'UpVote') {
        console.log('In if 2')
       throw { statusCode: 400, message: 'Proposal cannot be upvoted' };
      }
      let serverDate= moment(Date.now()).format();
      if(moment(proposal.expirationDate).format() < serverDate ){
        
        await this.proposalModel.findByIdAndUpdate(
          proposal._id,
          {
            $set: { status: 'Rejected' },
          },
          { runValidators: true, new: true },
        );
        
        console.log('In if 3')
        throw { statusCode: 400, message: 'Proposal cannot be upvoted since it is expired' };
      }
      console.log('Hello')    

      const checkUserExist = await this.userModel.find({
        email: req.body.email,
      });
      if (checkUserExist.length == 0) {
        console.log('In if 4')
       throw { statusCode: 400, message: 'User does not exist' };
      }
      const check = proposal.votes.some(el => {
        //Here is the name validation (A user cannot vote twice)
        if (el.email == req.body.email) {
          console.log('In if 5')
         throw { statusCode: 400, message: 'User cannot vote again' };
        }
      });

      const result = await this.proposalModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            votes: { date: Date.now(), email: req.body.email },
          },
        },
        { runValidators: true, new: true },
      );

      const result2 = await this.userModel.findOneAndUpdate(
        { email: req.body.email },
        { $push: { proposalVote: result._id } },
      );

      const checkCount = await this.proposalModel.findById(req.params.id);
      const Attributes = await this.DAOAttributesModel.find().exec();
      if (Attributes.length == 0) {
        console.log('In if 6')
        console.log('Here')
        throw { statusCode: 404, message: 'No attributes found!' };
      }
      if (checkCount.votes.length > result.minimumUpvotes - 1) {
        await this.updateProposalStatus(req.params.id, 'Voting');
        let date = new Date();

        if (date.getDate() < 16) {
          date = moment(Date.now())
            .add(1, 'M')
            .format('YYYY-MM-02, 00:00:00');
        } else {
          date = moment(Date.now())
            .add(2, 'M')
            .format('YYYY-MM-02, 00:00:00');
        }

        const setMonth = await this.proposalModel.findByIdAndUpdate(
          req.params.id,
          { $set: { votingDate: date } },
        );
      }
      return 'Success';
    } catch (err) {
      console.log("check error now",err)
      throw { statusCode: 400, message: err.message};
    }
  };

  getProposalsByStatus = async req => {
    try {
      let proposals = await this.proposalModel.find({ status: req.body.status });
      
      if(!proposals || proposals?.length==0){
        throw{statusCode:404,message:"No Proposal Found"}
      }
      if(req.body.status=="UpVote"){
        let serverDate = moment(Date.now()).format();

        for(let i=0 ; i < proposals.length; i++){
          if(moment(proposals[i].expirationDate).format() < serverDate){
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
        const emailResult = await this.NodemailerService.sendEmail(req);
      console.log('Email sent',emailResult)
      }
      return result;
    } catch (err) {
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
      if (proposal.status != 'Pending') {
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
          message: 'User with provided numioAddress doesnot exist',
        };
      }
      if (user.numioAddress != proposal.numioAddress) {
        throw { statusCode: 401, message: 'Unauthorized!' };
      }
      console.log("req.body is " , req.body)
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
      console.log("updated",updateProposal)
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
      if (proposal.status != 'Pending' && proposal.status != 'Rejected') {
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
          message: 'User with provided numioAddress doesnot exist',
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
}