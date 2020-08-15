import { Module } from '@nestjs/common';

import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProposalSchema } from './proposal.model';

import { UserService } from '../user/user.service';
import { UserSchema } from '../user/user.model';
import { StakeSchema } from '../stake/stake.model';

import { TransactionService } from '../transaction/transaction.service';
import { TransactionSchema } from '../transaction/transaction.model';
import { DAOAttributesSchema } from '../admin/admin.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Proposal', schema: ProposalSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Stake', schema: StakeSchema },
      { name: 'DAOAttributes', schema: DAOAttributesSchema }
    ]),
  ],
  controllers: [ProposalController],
  providers: [ProposalService, TransactionService, UserService],
})
export class ProposalModule {}
