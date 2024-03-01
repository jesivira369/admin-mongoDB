import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Permission } from "src/apps/permissions/schemas/permission.schema";

@Schema()
export class Role {
 
    @Prop({
        unique: true,
        uppercase: true,
        required: true,
        trim: true
    })
    name: string;

    @Prop({ type: [Types.ObjectId], ref: 'Permission', default: []})
    permissions: Types.ObjectId[];
}

export const roleSchema = SchemaFactory.createForClass(Role);