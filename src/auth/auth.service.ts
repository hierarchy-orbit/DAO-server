import { Injectable } from '@nestjs/common';
import jwt = require('jsonwebtoken');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signin(req, res) {
    try {
      console.log(req.body.email);
      console.log(process.env.SECRET_KEY);

      const userExist = await this.userModel.findOne({ email: req.body.email });
      if (!userExist) {
        throw { statusCode:404,message: 'User with this email doesnot exist' };
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
}
