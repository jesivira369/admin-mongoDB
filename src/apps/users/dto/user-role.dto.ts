import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class UserRoleDto {
  @ApiProperty({
    description: 'The role of the user',
    name: 'role',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  roleName: string;
}
