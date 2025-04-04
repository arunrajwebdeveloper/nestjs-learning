import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid User ID format');
    }

    const user = await this.userModel
      .findById(id)
      .select('-refreshToken -password')
      .exec(); // to remove key add - infront, to select specific key just add keys (only one method works at a time)
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // THIS IS FOR REFRESH TOKEN VALIDATION
  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid User ID format');
    }

    const user = await this.userModel
      .findById(id)
      .select('refreshToken')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    const hashedToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedToken,
    });
  }

  async updateUserDetails(
    id: string,
    details: CreateUserDetailsDto,
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { userDetails: details },
      { new: true },
    );

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userDetails: user.userDetails,
    };
  }

  /**
   * Validate Refresh token
   */

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.findOne(userId);

    if (!user || !user.refreshToken) return false;

    return bcrypt.compare(refreshToken, user.refreshToken);
  }

  /**
   * Validate email format using regex
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
