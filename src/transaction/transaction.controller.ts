/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Req, Res, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Request, Response } from 'express';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Here we get all the transactions
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
  // Here we get the transaction by Id
  @Get('/:id')
  async getTransactionById(@Req() req: Request, @Res() res: Response) {
    try {
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
  // Here we get transaction of a created proposal
  @Get('/proposal/:id')
  async getTransactionOfCreateProposal(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
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
  // Here we get transactions of stakes on a proposal
  @Get('/stake/proposal/:id')
  async getTransactionsOfStakesOnProposal(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const transactions = await this.transactionService.getTransactionsOfStakesOnProposal(
        req.params.id,
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
  // Here we get all the transactions of a specific user
  @Get('/user/:id')
  async getTransactionsOfUser(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.params.id) {
        throw {
          statusCode: 400,
          message: 'Please provide user id in the params',
        };
      }
      const transactions = await this.transactionService.getTransactionsOfUser(
        req,
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
  // Here we get all the transactions of user of a specific user on creating proposals
  @Get('/proposals/user/:id')
  async getTransactionsOfUserOnCreatingProposals(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      if (!req.params.id) {
        throw {
          statusCode: 400,
          message: 'Please provide user id in the params',
        };
      }
      const transactions = await this.transactionService.getTransactionsOfUserOnCreatingProposals(
        req,
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
  // Here we get all the transactions of user of a specific user on staking on proposals
  @Get('/stakes/user/:id')
  async getTransactionsOfUserOnStakingProposals(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      if (!req.params.id) {
        throw {
          statusCode: 400,
          message: 'Please provide user id in the params',
        };
      }
      const transactions = await this.transactionService.getTransactionsOfUserOnStakingProposal(
        req,
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
