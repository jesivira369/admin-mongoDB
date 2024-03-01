import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PermissionUpdateDto {
    @ApiProperty({
        name: 'originalName',
        description: 'Original Permission name',
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    originalName!: string;

    @ApiProperty({
        name: 'newName',
        description: 'New Permission name',
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    newName!: string;
}