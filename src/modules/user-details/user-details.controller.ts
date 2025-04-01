import {
  Controller,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDetailsService } from './user-details.service';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';
import { UsersService } from '../users/users.service';

@ApiTags('User Details')
@Controller('user-details')
export class UserDetailsController {
  constructor(
    private userDetailsService: UserDetailsService,
    private usersService: UsersService,
  ) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create user details and link to user' })
  @ApiResponse({
    status: 201,
    description: 'User details created successfully',
  })
  async createUserDetails(
    @Param('userId') userId: string,
    @Body() detailsDto: CreateUserDetailsDto,
  ) {
    // Check if user exists
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Create UserDetails
    const userDetails = await this.userDetailsService.create(detailsDto);

    // Link UserDetails to User
    await this.usersService.updateUserDetails(
      userId,
      userDetails._id.toString(),
    );

    return {
      message: 'User details added successfully',
      userDetails,
    };
  }
}
