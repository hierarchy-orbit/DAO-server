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
    numioAddress: { type: String, required: true },
    collateral: { type: Number, required: true },
    reward: { type: Number, required: true },
    status: {
      type: String,
      default: 'Pending',
      enum: [
        'Pending',
        'Rejected',
        'Accepted',
        'UpVote',
        'Voting',
        'Draw',
        'Fail',
      ],
    },
    githubLink: { type: String, default: '' },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },

    purpose: { type: String, required: true },
    importance: { type: String, required: true },
    fundsUsage: { type: String, required: true },
    personalExperience: { type: String, required: true },
    experiencedYear: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true },
);

export interface Proposal {}
