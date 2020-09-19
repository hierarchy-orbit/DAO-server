import * as mongoose from 'mongoose';

export const DAOAttributesSchema = new mongoose.Schema({
  minimumUpvotes: {
    type: Number,
    required: true,
  },
  monthlyBudget: {
    type: Number,
    required: true,
  },
  maxUpvoteDays: {
    type: Number,
    require: true,
  },
},{ timestamps: true });

export interface DAOAttributes {
  mimimumUpvotes: number;
  monthlyBudget: number;
  maxUpvoteDays: number;
}
