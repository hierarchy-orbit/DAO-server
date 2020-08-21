import * as mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
  numioAddress: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  walletAddress: {
    type: String,
    required: true,
  },
  proposalVote: [
    {
      //type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
    },
  ],
  proposalStake: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
    },
  ],
  isAdmin:{
    type:Boolean,
    default:"false"
  }
});

export interface User {
  numioAddress: string;
  email: string;
  walletAddress: string;
  proposalStake: mongoose.Schema.Types.ObjectId;
  proposalVote: mongoose.Schema.Types.ObjectId;
  isAdmin: boolean;
}
