/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal } from '../proposal/proposal.model';
import { Cron } from '@nestjs/schedule';
const axios = require('axios');
const moment = require('moment');

@Injectable()
export class CronService {
  constructor(@InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,) {
    
    console.log('hereeee');
  }

  @Cron('1 0 0 5 * *')
  handleCron() {
    console.log('cron job is running,calculating voting results');
    this.votingResultCalculation({ body: { status: 'Voting' } });
  }

  votingResultCalculation = async req => {
    //   let setSchedule = '0 0 0 4 * *';
    try {
      const votingProposals = await this.proposalModel.find({
        status: req.body.status,
      });
      if (votingProposals.length === 0) {
        throw {
          statusCode: 404,
          message: `No proposal with voting status ${req.body.status} found`,
        };
      }

      let utcDate;
      let resultDate;
      // await axios
      //   .get('http://worldtimeapi.org/api/timezone/America/New_York')
      //   .then(value => {
      //     utcDate=moment(value.data.utc_datetime).format();
      //   })
      //   .catch(err => {
      //     console.log('Error occured is ', err);
      //   });

      utcDate = moment(Date.now()).format();
      resultDate = moment(votingProposals[0].votingDate)
        .add(3, 'days')
        .format();

      console.log('votingDate is', new Date(votingProposals[0].votingDate));
      console.log('resultDate is', resultDate);
      console.log('utcDate is', utcDate);

      console.log('comparison', resultDate < utcDate);

      let totalVotes = 0;
      console.log('proposals with voting status are --->');
      // calculating total votes
      for (let i = 0; i < votingProposals.length; i++) {
        if (
          moment(votingProposals[i].votingDate)
            .add(3, 'days')
            .format() < utcDate
        ) {
          console.log(votingProposals[i].name);
          totalVotes += votingProposals[i].stake.length;
        }
      }
      console.log('total votes are', totalVotes);

      // updating proposal status according to percentage of votes on it
      for (let i = 0; i < votingProposals.length; i++) {
        if (
          moment(votingProposals[i].votingDate)
            .add(3, 'days')
            .format() < utcDate
        ) {
          if (
            totalVotes !== 0 &&
            votingProposals[i].stake.length / totalVotes >= 0.51
          ) {
            console.log(
              'updating proposal status to Accepted',
              votingProposals[i].name,
            );
            let completionDays=0,estCompletionDate;
            for(let t=0;t<votingProposals[i].milestone.length;t++){
              completionDays+=Number(votingProposals[i].milestone[t].days);
            }
            estCompletionDate=moment(utcDate)
            .add(completionDays, 'days')
            .format();

            await this.proposalModel.findByIdAndUpdate(
              votingProposals[i]._id,
              {
                $set: { status: 'Accepted' ,estCompletionDate},
              },
              { runValidators: true, new: true },
            );
            
            votingProposals.splice(i, 1);
            i--;
          } else if (
            totalVotes !== 0 &&
            votingProposals[i].stake.length / totalVotes < 0.51 &&
            votingProposals[i].stake.length / totalVotes !== 0.5
          ) {
            console.log(
              'updating proposal status to Fail and splicing it',
              votingProposals[i].name,
            );
            await this.proposalModel.findByIdAndUpdate(
              votingProposals[i]._id,
              {
                $set: { status: 'Fail' },
              },
              { runValidators: true, new: true },
            );
            votingProposals.splice(i, 1);
            i--;
          }
        }
      }
      console.log('proposals array after splicing are --->', votingProposals);
      console.log(
        'length of the votingProposals is -->',
        votingProposals.length,
      );
      if (votingProposals.length === 2) {
        for (let i = 0; i < votingProposals.length; i++) {
          if (
            moment(votingProposals[i].votingDate)
              .add(3, 'days')
              .format() < utcDate
          ) {
            if (
              totalVotes !== 0 &&
              (votingProposals[i].stake.length / totalVotes) * 100 === 50
            ) {
              votingProposals[i] = await this.proposalModel.findByIdAndUpdate(
                votingProposals[i]._id,
                {
                  $set: { status: 'Draw' },
                },
                { runValidators: true, new: true },
              );
            }
          }
        }
        console.log(
          'proposals array after assigning Draw are --->',
          votingProposals,
        );
      } else {
        for (let i = 0; i < votingProposals.length; i++) {
          if (
            moment(votingProposals[i].votingDate)
              .add(3, 'days')
              .format() < utcDate
          ) {
            await this.proposalModel.findByIdAndUpdate(
              votingProposals[i]._id,
              {
                $set: { status: 'Fail' },
              },
              { runValidators: true, new: true },
            );
          }
        }
      }
    } catch (err) {
      throw err;
    }
  };
}
