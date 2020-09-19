/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
const cron = require('node-cron');
import { ProposalSchema } from './proposal.model';
const mongoose = require("mongoose");

const Proposal=mongoose.model("Proposal",ProposalSchema)

export const votingResultCalculation = async() => {
    //   let setSchedule = '0 0 4 * *';
    console.log("here")
    const proposals= await Proposal.find().exec();
    console.log("here2")
    console.log("proposals",proposals)
      let temp=cron.schedule('32 18 * * *', () => {
        console.log('running a task every 5 secs at 18:00');
        // date = new Date();
      });
      await temp.start();
    };