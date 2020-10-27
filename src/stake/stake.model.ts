import * as mongoose from 'mongoose';

export const StakeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    TxHash: { type: String, required: true, unique: true },
    days: {
      type: Number,
      required: true,
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
    },
    reward: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export interface Stake {
  amount: number;
  TxHash: string;
  days: number;
  proposalId: mongoose.Schema.Types.ObjectId;
  reward: number;
}
