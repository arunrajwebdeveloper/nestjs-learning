import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDetailsDto } from './create-user-details.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' }) // ✅ Adds schema details in Swagger
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '' })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ type: CreateUserDetailsDto }) // ✅ Include user details
  @ValidateNested()
  @Type(() => CreateUserDetailsDto)
  @IsOptional()
  userDetails?: CreateUserDetailsDto;
}
