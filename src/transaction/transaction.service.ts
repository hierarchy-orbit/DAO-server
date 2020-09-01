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

  async getAllTransactions(): Promise<Transaction[]> {
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
}
