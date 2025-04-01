import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDetailsResponseDto } from '../../user-details/dto/user-details-response.dto';

export class UserResponseDto {
  @ApiProperty({ example: '65f3a7e3b7e8c2a5f4a2d4e7' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiPropertyOptional({ type: UserDetailsResponseDto }) // ✅ Ensure userDetails is included
  userDetails?: UserDetailsResponseDto;
}
