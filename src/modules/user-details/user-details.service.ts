import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserDetails,
  UserDetailsDocument,
} from './schemas/user-details.schema';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectModel(UserDetails.name)
    private userDetailsModel: Model<UserDetailsDocument>,
  ) {}

  async create(detailsDto: CreateUserDetailsDto): Promise<UserDetails> {
    const userDetails = new this.userDetailsModel(detailsDto);
    return userDetails.save();
  }

  async findById(id: string): Promise<UserDetails | null> {
    return this.userDetailsModel.findById(id).exec();
  }
}
