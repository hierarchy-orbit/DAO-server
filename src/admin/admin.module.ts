import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';

import {DAOAttributesSchema} from './admin.model';
import {UserSchema}from '../user/user.model'
import {ProposalSchema}from '../proposal/proposal.model'

@Module({
  imports: [MongooseModule.forFeature([{name:'DAOAttributes',schema:DAOAttributesSchema},{name:'User',schema:UserSchema},{name:'Proposal',schema:ProposalSchema}])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
