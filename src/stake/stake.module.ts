import { Module } from '@nestjs/common';
import { StakeController } from './stake.controller';
import { StakeService } from './stake.service';

@Module({
  controllers: [StakeController],
  providers: [StakeService]
})
export class StakeModule {}
