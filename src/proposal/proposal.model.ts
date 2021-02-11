/* eslint-disable @typescript-eslint/no-empty-interface */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const ProposalSchema = new Schema(
  {
    budget: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    milestone: { type: Array, required: true },
    votingDate: { type: Date },
    expirationDate: { type: Date },
    estCompletionDate: { type: Date },
    stake: [],
    votes: [],
    minimumUpvotes: { type: Number },
    votingStatus: { type: Boolean, default: false },
    numioAddress: { type: String, required: true },
    collateral: { type: Number, required: true },
    reward: { type: Number, required: false },
    status: {
      type: String,
      default: 'InTransaction',
      enum: [
        'InTransaction',
        'Pending',
        'Rejected',
        'Accepted',
        'UpVote',
        'Voting',
        'Draw',
        'Fail',
        'Completed',
      ],
    },
    githubLink: { type: String, default: '' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
    purpose: { type: String, required: true },
    importance: { type: String, required: false },
    experiencedYear: { type: Number, required: false },
    duration: { type: Number, required: true },
    userProfession: { type: String, required: true },
    counter: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export interface Proposal {}
