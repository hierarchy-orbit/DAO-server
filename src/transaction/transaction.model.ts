import * as mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema({
  TxHash: {
    type: String,
    required: true,
    unique: true,
  },
  Type: { type: String, required: true, enum: ['Proposal', 'Stake'] },
  numioAddress: {
    type: String,
    required: true,
  },
  stakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stake',
  },
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
  },
});

export interface Transaction {
  TxHash: string;
  Type: string;
  days: number;
  stakeId: mongoose.Schema.Types.ObjectId;
  proposalId: mongoose.Schema.Types.ObjectId;
}
