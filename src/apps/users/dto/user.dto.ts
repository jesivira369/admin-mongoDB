import { IsEmail, IsNotEmpty, IsString, IsDate, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RoleDto } from 'src/apps/roles/dto/roles.dto';

export class UserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    name: 'name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'The email of the user',
    name: 'email',
    required: true,
 })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    example: '1990-01-01', 
    description: 'The birthdate of the user',
    name: 'birthDate',
    required: true,
 })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate!: Date;

  @ApiProperty({ 
    type: RoleDto, 
    description: 'The role of the user',
    name: 'role',
    required: false,
 })
  @IsOptional()
  @IsObject()
  @Type(() => RoleDto)
  role?: RoleDto;
}
