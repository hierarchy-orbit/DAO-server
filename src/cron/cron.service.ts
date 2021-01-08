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
import Web3 from 'web3'
import {PHNX_PROPOSAL_ABI} from '../contracts/contracts'

@Injectable()
export class CronService {
  constructor(@InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,) {
  }

   @Cron('1 0 0 5 * *')
  // @Cron('1 30 * * * *')
  votingTimeEnd() {
    console.log('cron job is running,calculating voting results');
    this.votingResultCalculation({ body: { votingStatus: true } });
  }

  // @Cron('1 0 5 2 * *')
   @Cron('1 0 * * * *')
  votingDateArrival() {
    console.log('cron job is running, voting starts now');
    this.votingTimeStart({ body: { status: "Voting" } });
  }
  
  getCurrentGasPrices = async () => {
    try {
        let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
        let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10
        };
        console.log(prices)
        return prices;
    } catch (e) {
        console.log(e)
    }
};
  
updateStatus = async (id, status) => {
  console.log('Here')
  // console.log('++++++++++++++++++++',PHNX_PROPOSAL_ABI)  
  console.log('Update status from blockchain')
  const web3 = new Web3('https://rinkeby.infura.io/v3/98ae0677533f424ca639d5abb8ead4e7');
 
 const contract = new web3.eth.Contract(PHNX_PROPOSAL_ABI,'0x2c1A4C3c1bcb1eE2CCFF5eB53348CA0D028AEb6d');
  try {
    let count = await web3.eth.getTransactionCount(
      "0x51a73C48c8A9Ef78323ae8dc0bc1908A1C49b6c6",
      "pending"
    );
    let gasPrices = await this.getCurrentGasPrices();
    console.log(gasPrices);
    let rawTransaction = {
      from: "0x51a73C48c8A9Ef78323ae8dc0bc1908A1C49b6c6",
      to: "0x2c1A4C3c1bcb1eE2CCFF5eB53348CA0D028AEb6d",
     data: contract.methods.updateProposalStatus(id, status).encodeABI(),
      gasPrice: 300 * 1000000000,
      nonce: count,
      gasLimit: web3.utils.toHex(2000000),
    };
    let pr_key =
      process.env.adminPrivateKey;
    let signed = await web3.eth.accounts.signTransaction(
      rawTransaction,
      pr_key
    );
    await web3.eth
      .sendSignedTransaction(signed.rawTransaction)
      .on("confirmation", (confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          return true
        }
      })
      .on("error", (error) => {
        return false
      })
      .on("transactionHash", async (hash) => {
        console.log("transaction has -->", hash);
      });
  } catch (Err) {
    console.log(Err);
    return false
  }
};

  votingResultCalculation = async req => {
    //   let setSchedule = '0 0 0 4 * *';
    try {
      const votingProposals = await this.proposalModel.find({
        votingStatus: req.body.votingStatus,
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

      // console.log('votingDate is', new Date(votingProposals[0].votingDate));
      // console.log('resultDate is', resultDate);
      // console.log('utcDate is', utcDate);

      // console.log('comparison', resultDate < utcDate);

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
     // console.log('total votes are', totalVotes);

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

            await this.updateStatus(votingProposals[i]._id, 3)

            console.log('Voting proposal ID ----->',votingProposals[i]._id)
            
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

          //  await this.updateStatus(votingProposals[i]._id, 5)

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

  votingTimeStart = async req => {
    try{
      console.log("req.body is ", req.body)
      const votingProposals = await this.proposalModel.find({
        status: req.body.status,
      });
     // console.log("voting proposals are ", votingProposals)
      if (votingProposals.length === 0) {
        throw {
          statusCode: 404,
          message: `No proposal with voting status ${req.body.status} found`,
        };
      }

      let serverDate= moment(Date.now()).format();
      console.log("server Date is "
      , serverDate)

      for(let i=0; i < votingProposals.length ; i++){
        console.log('Moment date',moment(votingProposals[i].votingDate).format())
        console.log('Server date',serverDate)
        console.log(votingProposals[i].name, " and date ",moment(votingProposals[i].votingDate).format() , " and server date" , serverDate )
        if(moment(votingProposals[i].votingDate).format() <= serverDate){
          await this.proposalModel.findByIdAndUpdate(
            votingProposals[i]._id,
            {
              $set: { votingStatus: true },
            },
            { runValidators: true, new: true },
          ).then((proposal:any)=>{
            console.log("updated proposal " , proposal.name , " with voting date " , proposal.votingDate)
          }).catch((err)=>{
            console.log("error updating proposal " , err)
          })
        }
      }
    }
    catch(err){
      throw err;
    }
  }
}
