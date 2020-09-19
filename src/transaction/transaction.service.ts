/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stake } from '../stake/stake.model';
import { User } from 'src/user/user.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}
  async createTransaction(TxHash, type, numioAddress, Id) {
    try {
      let newTransaction;
      if(type=="Proposal"){
        newTransaction = await this.transactionModel({
          TxHash,
          Type: type,
          numioAddress,
          proposalId:Id,
        });
      }else{
        newTransaction= await this.transactionModel({
          TxHash,
          Type: type,
          numioAddress,
          stakeId:Id,
        });
      }
      
      const createdTransaction = await this.transactionModel.create(
        newTransaction,
      );
      return createdTransaction;
    } catch (error) {
      throw error;
    }
  }
  async getAllTransactions() {
    try {
      const transactions = await this.transactionModel.find().populate("stakeId , proposalId").exec();
      if (transactions.length !== 0) {
        return transactions;
      } else {
        throw { statusCode: 404, message: 'No transactions found!' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTransactionById(id) {
    try {
      const transaction = await this.findTransaction(id);
      if (transaction) {
        return transaction;
      } else {
        throw { statusCode: 404, message: 'Transaction not found' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTransactionOfCreateProposal(propId, propTYPE) {
    try {
      const trans = await this.transactionModel.findOne({
        Type: propTYPE,
        proposalId: propId,
      }).populate("stakeId , proposalId");
      if (!trans) {
        throw { message: 'No transaction found!' };
      }
      return trans;
    } catch (error) {
      throw error;
    }
  }
  async getTransactionsOfStakesOnProposal(id) {
    try {
      console.log('proposalId is ===> ', id);

      const stakes = await this.stakeModel.find({ proposalId: id });
      if (stakes.length == 0 || !stakes) {
        throw { statusCode: 404, message: 'No stake found' };
      }
      console.log('stakes are ===> ', stakes);
      const transactions = [];
      for (let i = 0; i < stakes.length; i++) {
        const trans = await this.transactionModel.find({
          TxHash: stakes[i].TxHash,
        }).populate("stakeId , proposalId");
        transactions.push(trans);
      }
      if (transactions.length == 0) {
        throw 'No transaction found!';
      }
      return transactions;
    } catch (error) {
      console.log('error is ==> ', error);
      throw error;
    }
  }
  async getTransactionsOfUser(req): Promise<Transaction[]> {
    try {
      console.log('user id is ===>', req.params.id);
      const user = await this.userModel
        .findOne({ numioAddress: req.params.id })
        .exec();
      console.log('user is ===>', user);
      if (!user) {
        throw { statusCode: 404, message: 'User not found!' };
      }
      const transactions = await this.transactionModel
        .find({ numioAddress: req.params.id })
        .populate("stakeId , proposalId")
        .exec();
      if (transactions.length !== 0) {
        return transactions;
      } else {
        throw { statusCode: 404, message: 'No transaction found!' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTransactionsOfUserOnCreatingProposals(req): Promise<Transaction[]> {
    try {
      console.log('user id is ===>', req.params.id);
      const user = await this.userModel
        .findOne({ numioAddress: req.params.id })
        .exec();
      console.log('user is ===>', user);
      if (!user) {
        throw { statusCode: 404, message: 'User not found!' };
      }
      const transactions = await this.transactionModel
        .find({ numioAddress: req.params.id, Type: 'Proposal' })
        .populate("stakeId , proposalId")
        .exec();
      if (transactions.length !== 0) {
        return transactions;
      } else {
        throw { statusCode: 404, message: 'No transaction found!' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTransactionsOfUserOnStakingProposal(req): Promise<Transaction[]> {
    try {
      console.log('user id is ===>', req.params.id);
      const user = await this.userModel
        .findOne({ numioAddress: req.params.id })
        .exec();
      console.log('user is ===>', user);
      if (!user) {
        throw { statusCode: 404, message: 'User not found!' };
      }
      const transactions = await this.transactionModel.find({
        numioAddress: req.params.id,
        Type: 'Stake',
      }).populate("stakeId , proposalId");

      console.log(transactions);
      if (transactions.length !== 0) {
        return transactions;
      } else {
        throw { statusCode: 404, message: 'No transaction found!' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  private async findTransaction(id: string) {
    let transaction;
    try {
      transaction = await this.transactionModel.findById(id).populate("stakeId , proposalId").exec();
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
