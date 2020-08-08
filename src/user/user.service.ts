/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async addUser(user) {
    try {
      const uniqueUser = await this.findUser(user.numioAddress);
      if (!uniqueUser) {
        user.isAdmin = false;
        const newUser = this.userModel(user);
        const createdUser = await this.userModel.create(newUser);

        return createdUser;
      } else {
        throw { statusCode: 400, message: 'User already exist' };
      }
    } catch (error) {
      console.log('sdsdsd ', error);
      throw error;
    }
  }
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();
      if (users.length !== 0) {
        return users;
      } else {
        throw { statusCode: 404, message: 'No users found!' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getUserByEmail(email) {
    let user;
    try {
      if (!email) {
        throw { statusCode: 400, message: 'Please provide email!' };
      }
      user = await this.userModel.findOne({ email: email }).exec();
      if (user) {
        return user;
      } else {
        throw { statusCode: 405, message: 'No user found!' };
      }
    } catch (error) {
      throw error;
    }
  }
  async getUserById(id): Promise<User> {
    try {
      const user = await this.findUser(id);
      if (user) {
        return user;
      } else {
        throw { statusCode: 404, message: 'User not found' };
      }
    } catch (error) {
      throw error;
    }
  }
  private async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ numioAddress: id }).exec();
      return user;
    } catch (error) {
      throw error;
    }
  }
}
