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
        userDetails: ['fullname', 'email', 'profileImage', 'numio_id'],
        app_secret: process.env.app_secret,
      };
      const resp = await numio.verifyToken(temp);
      console.log('response -->', resp.data.data);
      if (!resp || resp.data.status !== 200) {
        throw { statusCode: 500, message: 'Internal server error' };
      }
      const {
        email,
        numioId,
        first_name,
        last_name,
      } = resp.data.data.userInformation;

      console.log('email==>', email);
      console.log('numioId==>', numioId);
      console.log(process.env.SECRET_KEY);

      const userExist = await this.userModel.findOne({ email: email });
      if (!userExist) {
        //throw { statusCode:404,message: 'User with this email doesnot exist' };
        const userData = {
          numioAddress: numioId,
          firstName: first_name,
          lastName: last_name,
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
          _id: createdUser._id,
          email: createdUser.email,
          first_name: createdUser.firstName,
          last_name: createdUser.lastName,
          isAdmin: createdUser.isAdmin,
          numioAddress: createdUser.numioAddress,
          proposalStake: createdUser.proposalStake,
          proposalVote: createdUser.proposalVote,
          profileImage: resp.data.data.userInformation.profileImage,
          token,
        };
        console.log('userrrrrrrrr ', user);
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
        _id: userExist._id,
        email: userExist.email,
        first_name: userExist.firstName,
        last_name: userExist.lastName,
        isAdmin: userExist.isAdmin,
        numioAddress: userExist.numioAddress,
        proposalStake: userExist.proposalStake,
        proposalVote: userExist.proposalVote,
        profileImage: resp.data.data.userInformation.profileImage,
        token,
      };
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async loginWithMetaMask(req) {
    try {
      const userExist = await this.userModel.findOne({
        numioAddress: req.body.Address,
      });
      console.log('req.body', req.body);
      console.log('userExist', userExist);

      if (!userExist) {
        if (req.body.register) {
          const { first_name, last_name, email } = req.body;
          const userData = {
            numioAddress: req.body.Address,
            firstName: first_name,
            lastName: last_name,
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
            _id: createdUser._id,
            email: createdUser.email,
            first_name: createdUser.firstName,
            last_name: createdUser.lastName,
            isAdmin: createdUser.isAdmin,
            numioAddress: createdUser.numioAddress,
            proposalStake: createdUser.proposalStake,
            proposalVote: createdUser.proposalVote,
            profileImage: '',
            token,
          };
          console.log('userrrrrrrrr ', user);
          return { signInSuccess: true, user };
        }
        const user = { signInSuccess: false, notRegistered: true };
        return user;
      }

      if (req.body.register) {
        return {
          signInSuccess: false,
          alreadyRegistered:
            'User with the current wallet address already exists!',
        };
      }

      const token = jwt.sign(
        { email: userExist.email },
        process.env.SECRET_KEY,
        {
          expiresIn: '1y',
        },
      );
      if (!token) {
        throw { statusCode: 400, message: 'token not generated!' };
      }
      console.log('Signed IN!');
      const user = {
        _id: userExist._id,
        email: userExist.email,
        first_name: userExist.firstName,
        last_name: userExist.lastName,
        isAdmin: userExist.isAdmin,
        numioAddress: userExist.numioAddress,
        proposalStake: userExist.proposalStake,
        proposalVote: userExist.proposalVote,
        profileImage: '',
        token,
      };
      return { signInSuccess: true, user };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
