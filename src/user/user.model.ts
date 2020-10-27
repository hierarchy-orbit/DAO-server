import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    numioAddress: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: { type: String, required: true, unique: true },
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
    isAdmin: {
      type: Boolean,
      default: 'false',
    },
  },
  { timestamps: true },
);

export interface User {
  numioAddress: string;
  firstName: string;
  lastName: string;
  email: string;
  proposalStake: mongoose.Schema.Types.ObjectId;
  proposalVote: mongoose.Schema.Types.ObjectId;
  isAdmin: boolean;
}
