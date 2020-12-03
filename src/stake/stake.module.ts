import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StakeController } from './stake.controller';
import { StakeService } from './stake.service';
import { StakeSchema } from './stake.model';
import { ProposalService } from '../proposal/proposal.service';
import { ProposalSchema } from '../proposal/proposal.model';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionSchema } from '../transaction/transaction.model';
import { UserService } from '../user/user.service';
import { UserSchema } from '../user/user.model';
import { DAOAttributesSchema } from 'src/admin/admin.model';
import { NodemailerService } from '../nodemailer/nodemailer.service'
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Stake', schema: StakeSchema }]),
    MongooseModule.forFeature([{ name: 'Proposal', schema: ProposalSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'DAOAttributes', schema: DAOAttributesSchema },
    ]),
  ],
  controllers: [StakeController],
  providers: [StakeService, ProposalService, TransactionService, UserService, NodemailerService],
})
export class StakeModule {}
