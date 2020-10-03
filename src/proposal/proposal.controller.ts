/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from 'express';
import { ProposalService } from './proposal.service';
import { Controller, Get, Post, Req, Res, Delete, Put } from '@nestjs/common';
@Controller('proposal')
export class ProposalController {
  constructor(private readonly ProposalService: ProposalService) {}
  // Here we get ALL proposals from the database
  @Get()
  async getAllProposals(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.getAllProposals();
      if (result.length == 0) {
        res
          .status(400)
          .send({ responseCode: 400, result: 'No Proposals Found' });
      } else {
        res.status(200).send({
          responseCode: 200,
          result: result,
        });
      }
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }

  // Here post a NEW proposal
  @Post('')
  async postProposal(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.postProposal(req.body, res);
      //console.log('Response --->>', result._id);
      // console.log(req.body);
      res.status(200).send({
        responseCode: 200,
        result: result,
      });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }
  // Here we VOTE on a proposal
  @Post('/vote/:id')
  async voteOnProposal(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.VoteOnProposal(req, res);
      res.status(200).send({
        statusCode: 200,
        result: result,
      });
    } catch (err) {
      //console.log('Hello11', err);
      res.status(400).send({
        statusCode: 400,
        message: err.message,
      });
    }
  }

  // Here we get proposals by giving the ID in PARAMS
  @Get('/:id')
  async getProposalsById(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.getProposalsById(req.params.id);
      if (result) {
        res.status(200).send({
          responseCode: 200,
          result: result,
        });
      } else {
        res.status(400).send({
          responseCode: 400,
          result: 'No Proposal Found',
        });
      }
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }
  // Here we UPDATE the status of a proposal from ID
  @Put('/:id')
  async updateProposalStatus(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.updateProposalStatus(
        req.params.id,
        req.body.status,
      );
      if (result) {
        res.status(200).send({
          responseCode: 200,
          result: result,
        });
      } else {
        res.status(200).send({
          responseCode: 200,
          result: 'No Proposal Found',
        });
      }
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }
  s;
  // Here we get a proposal by NUMIOADDRESS
  @Post('/getByNumioAddress')
  async getByNumioAddress(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.getProposalByNumioAddress(
        req.body.numioAddress,
      );

      res.status(200).send({
        statusCode: 200,
        result: result,
      });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err.message,
      });
    }
  }
  // Here we get proposals by NUMIOADDRESS whose status is accepted
  @Post('/getByNumioAddressAndProposalStatus')
  async getProposalByNumioAddressAndProposalStatus(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.getProposalByNumioAddressAndProposalStatus(
        req.body.numioAddress,
        req.body.status
      );

      res.status(200).send({
        statusCode: 200,
        result: result,
      });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err.message,
      });
    }
  }

  // Here we get Proposals by STATUS
  @Post('/status')
  async getPropsalsByStatus(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.ProposalService.getProposalsByStatus(req);
      if (result.length !== 0) {
        //console.log(req.body);
        res.status(200).send({
          responseCode: 200,
          result: result,
        });
      } else {
        res.status(400).send({ responseCode: 400, result: 'Not Found' });
      }
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }
  // Here we CHANGE the STATUS of a MILESTONE by ADMIN
  @Put('/changeStatusOfMilestoneByAdmin/:id')
  async changeStatusOfMilestoneByAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.ProposalService.changeStatusOfMilestoneByAdmin(
        req,
        res,
      );
      res.status(200).send({ responseCode: 200, result: result });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }

  // Here we CHANGE the STATUS of a MILESTONE by USER
  @Put('/changeStatusOfMilestoneByUser/:id')
  async changeStatusOfMilestoneByUser(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.ProposalService.changeStatusOfMilestoneByUser(
        req,
        res,
      );
      res.status(200).send({ responseCode: 200, result: result });
    } catch (err) {
      res.status(400).send({
        responseCode: 400,
        result: err,
      });
    }
  }

     // Here we UPDATE a proposals in the database by Id
     @Put('/updateProposal/:id')
     async updateProposal(@Req() req: Request, @Res() res: Response) {
       try {
         console.log("in delete")
         const result = await this.ProposalService.updateProposal(req);
         res.status(200).send({ responseCode: 200, result: result });
       } catch (err) {
         res.status(err.statusCode).send({
           responseCode: err.statusCode,
           result: err.message,
         });
       }
     }

    // Here we DELETE a proposals in the database by Id
  @Delete('/singleProposal/:id')
  async deleteProposal(@Req() req: Request, @Res() res: Response) {
    try {
      console.log("in delete")
      const result = await this.ProposalService.deleteProposal(req);
      res.status(200).send({ responseCode: 200, result: result });
    } catch (err) {
      res.status(err.statusCode).send({
        responseCode: err.statusCode,
        result: err.message,
      });
    }
  }
}
