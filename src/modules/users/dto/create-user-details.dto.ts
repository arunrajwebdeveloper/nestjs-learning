import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDetailsDto {
  @ApiPropertyOptional({ example: '123 Street, City' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '1995-06-15' })
  @IsString()
  @IsOptional()
  dob?: string;
}
