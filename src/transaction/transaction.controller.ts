/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Req, Res, Get, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Request, Response } from 'express';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get('/')
  async getAllTransactions(@Req() req: Request, @Res() res: Response) {
    try {
      const transactions = await this.transactionService.getAllTransactions();
      res.status(200).send({
        responseCode: 200,
        result: transactions,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
  }
}
