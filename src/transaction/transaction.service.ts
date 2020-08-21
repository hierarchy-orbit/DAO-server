/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/user/user.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,

    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}
  async createTransaction(TxHash, type, numioAddress, stakeId) {
    try {
      const newTransaction = await this.transactionModel({
        TxHash,
        Type: type,
        numioAddress,
        stakeId,
      });
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
      const transactions = await this.transactionModel.find().exec();
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
      });
      if (!trans) {
        throw { message: 'No transaction found!' };
      }
      return trans;
    } catch (error) {
      throw error;
    }
  }
  async getTransactionsOfUser(req, res): Promise<Transaction[]> {
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
  async getTransactionsOfUserOnCreatingProposals(
    req,
    res,
  ): Promise<Transaction[]> {
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
  async getTransactionsOfUserOnStakingProposal(
    req,
    res,
  ): Promise<Transaction[]> {
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
      });

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
      transaction = await this.transactionModel.findById(id).exec();
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
