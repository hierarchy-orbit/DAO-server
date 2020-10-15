/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Body, Injectable } from '@nestjs/common';
import jwt = require('jsonwebtoken');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.model';
const numio = require('numio-sdk');

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signin(req) {
    try {
      console.log(req.body.email);
      console.log(process.env.SECRET_KEY);

      const userExist = await this.userModel.findOne({ email: req.body.email });
      if (!userExist) {
        throw {
          statusCode: 404,
          message: 'User with this email doesnot exist',
        };
      }
      const token = jwt.sign(
        { email: req.body.email },
        process.env.SECRET_KEY,
        {
          expiresIn: '5d',
        },
      );
      if (!token) {
        throw { statusCode: 400, message: 'token not generated!' };
      }
      console.log('Signed IN!');
      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async loginWithNumio(req) {
    try {
      const temp = {
        token: req.body.token,
        userDetails: ["fullname", "email", "profileImage", "numio_id"],
        app_secret : process.env.app_secret
      };
      const resp = await numio.verifyToken(temp);
      console.log('response -->', resp.data.data);
      if (!resp || resp.data.status !== 200) {
        throw { statusCode: 500, message: 'Internal server error' };
      }
      const { email,numioId } = resp.data.data.userInformation;

      console.log("email==>",email);
      console.log("numioId==>",numioId);
      console.log(process.env.SECRET_KEY);

      const userExist = await this.userModel.findOne({ email: email });
      if (!userExist) {
        //throw { statusCode:404,message: 'User with this email doesnot exist' };
        const userData = {
          numioAddress: numioId,
          walletAddress: '1234',
          email: email,
          isAdmin: false,
        };
        //user.isAdmin=false;
        const newUser = this.userModel(userData);
        const createdUser = await this.userModel.create(newUser);
        console.log('createdUser', createdUser);
        const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
          expiresIn: '1y',
        });
        if (!token) {
          throw { statusCode: 400, message: 'token not generated!' };
        }
        console.log('userRegistered && Signed IN!');
        const user = {
          ...resp.data.data.userInformation,
          _id: createdUser._id,
          isAdmin: createdUser.isAdmin,
          numioAddress: createdUser.numioAddress,
          walletAddress: createdUser.walletAddress,
          proposalVote: createdUser.proposalVote,
          proposalStake: createdUser.proposalStake,
          token,
        };
        return user;
      }
      const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
        expiresIn: '1y',
      });
      if (!token) {
        throw { statusCode: 400, message: 'token not generated!' };
      }
      console.log('Signed IN!');
      const user = {
        ...resp.data.data.userInformation,
        _id: userExist._id,
        isAdmin: userExist.isAdmin,
        numioAddress: userExist.numioAddress,
        walletAddress: userExist.walletAddress,
        proposalVote: userExist.proposalVote,
        proposalStake: userExist.proposalStake,
        token,
      };
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
