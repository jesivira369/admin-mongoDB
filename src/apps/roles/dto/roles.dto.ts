import { IsString, IsOptional, ArrayNotEmpty, ValidateNested, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { Type } from 'class-transformer';

export class RoleDto {
    @ApiProperty({
        name: 'name',
        description: 'Role name',
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ 
        name: 'permissions',
        description: 'Role permissions',
        type: PermissionDto,
        required: false,
        isArray: true,
     })
    @IsOptional()
    @IsArray()
    @Type(() => PermissionDto)
    permissions?: PermissionDto[] = [];
}