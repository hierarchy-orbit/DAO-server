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
  @Get('/:id')
  async getTransactionById(@Req() req: Request, @Res() res: Response) {
    try {
      //console.log(req.params.id)
      const transaction = await this.transactionService.getTransactionById(
        req.params.id,
      );
      res.status(200).send({
        responseCode: 200,
        result: transaction,
      });
    } catch (error) {
      res.status(error.statusCode).send({
        responseCode: error.statusCode,
        result: error.message,
      });
    }
    
  }
  @Get('/proposal/:id')
  async getTransactionOfCreateProposal(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log(req.params.id);
      console.log(req.body.TYPE);
      const transactions = await this.transactionService.getTransactionOfCreateProposal(
        req.params.id,
        req.body.TYPE,
      );
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
