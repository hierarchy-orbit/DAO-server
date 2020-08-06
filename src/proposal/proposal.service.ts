import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Proposal } from './proposal.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProposalService {
    constructor(
        @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>, ) {}
        getAllProposals = async () => {
            try {
        
              const result = await this.proposalModel.find();
              if (result.length!==0) {
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
              
              const createdProposal = await this.proposalModel.create(req);

              return createdProposal
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
}
