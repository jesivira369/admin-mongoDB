import { ConflictException, Injectable } from '@nestjs/common';
import { Permission } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionsService {

    constructor(
        @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>
    ) { }

    async createPermission(permission: PermissionDto) {

        const permissionExists = await this.permissionModel.findOne({ name: permission.name });

        if (permissionExists) {
            throw new ConflictException('Permission already exists');
        }

        const p = new this.permissionModel(permission);

        return p.save();
    }

    async getPermissions(name: string) {
        const filter = {};
        if (name) {
            filter['name'] = {
                $regex: name,
                $options: 'i'
            }
        }
        return this.permissionModel.find(filter);
    }

    async updatePermission(permission: any) {
        const { originalName, newName } = permission;

        const permissionExists = await this.permissionModel.findOne({ name: originalName });

        if (!permissionExists) {
            throw new ConflictException('Permission does not exist');
        }

        const permissionWithNewName = await this.permissionModel.findOne({ name: newName });

        if (permissionWithNewName) {
            throw new ConflictException('Permission with new name already exists');
        }

        await this.permissionModel.updateOne({ name: originalName }, { name: newName });

        return this.permissionModel.findById(permissionExists._id);
    }

    async deletePermission(name: string) {
        const permissionExists = await this.permissionModel.findOne({ name });

        if (!permissionExists) {
            throw new ConflictException('Permission does not exist');
        }

        return this.permissionModel.deleteOne({ name });
    }
}
