import { Module } from '@nestjs/common';
import { CronService } from './cron.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ProposalSchema } from '../proposal/proposal.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Proposal', schema: ProposalSchema }])],
  providers: [CronService]
})
export class CronModule {}
