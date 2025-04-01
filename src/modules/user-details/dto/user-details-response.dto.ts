import { ApiProperty } from '@nestjs/swagger';

export class UserDetailsResponseDto {
  @ApiProperty({ example: '123 Street, City' })
  address: string;

  @ApiProperty({ example: '+1234567890' })
  phone: string;

  @ApiProperty({ example: '1990-01-01' })
  dob: string;
}
