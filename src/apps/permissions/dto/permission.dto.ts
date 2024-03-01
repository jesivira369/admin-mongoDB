import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PermissionDto {

    @ApiProperty({
        name: 'name',
        description: 'Permission name',
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name!: string;
}