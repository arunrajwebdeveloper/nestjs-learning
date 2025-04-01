import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Put('user-details/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async updateUserDetails(
    @Param('id') id: string,
    @Body() details: CreateUserDetailsDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUserDetails(id, details);
  }
}
