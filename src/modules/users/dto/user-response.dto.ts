import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDetailsDto } from './create-user-details.dto';

export class UserResponseDto {
  @ApiProperty({ example: '65f3a7e3b7e8c2a5f4a2d4e7' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiPropertyOptional({ type: CreateUserDetailsDto }) // ✅ Include user details
  userDetails?: CreateUserDetailsDto;
}
