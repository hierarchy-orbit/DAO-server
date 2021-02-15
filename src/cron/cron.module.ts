import { Module } from '@nestjs/common';
import { CronService } from './cron.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ProposalSchema, BlockSchema } from '../proposal/proposal.model';
// import { BlockSchema } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Proposal', schema: ProposalSchema },
      { name: 'Block', schema: BlockSchema },
    ]),
  ],
  providers: [CronService],
})
export class CronModule {}
