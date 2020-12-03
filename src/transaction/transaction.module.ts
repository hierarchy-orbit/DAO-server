import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionSchema } from './transaction.model';
import { StakeSchema } from 'src/stake/stake.model';
import { UserSchema } from '../user/user.model';
import { ProposalSchema } from '../proposal/proposal.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Stake', schema: StakeSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Proposal', schema: ProposalSchema }
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
