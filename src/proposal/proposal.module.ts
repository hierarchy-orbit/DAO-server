import { Module } from '@nestjs/common';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProposalSchema } from './proposal.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Proposal', schema: ProposalSchema },
    ]),
  ],
  controllers: [ProposalController],
  providers: [ProposalService]
})
export class ProposalModule {}
