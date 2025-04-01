import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  // @IsString()
  // _id: string;

  @ApiProperty({ example: 'John Doe' }) // ✅ Adds schema details in Swagger
  @IsEmail()
  email: string;

  @ApiProperty({ example: '' }) // ✅ Adds schema details in Swagger
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
