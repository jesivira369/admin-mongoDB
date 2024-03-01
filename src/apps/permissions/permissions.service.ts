import { ConflictException, Injectable } from '@nestjs/common';
import { Permission } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PermissionDto } from './dto/permission.dto';
import { PermissionUpdateDto } from './dto/permissionUpdate.dto';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private readonly permissionModel: Model<Permission>) {}

  async createPermission(permission: PermissionDto) {
    const permissionExists = await this.findPermissionByName(permission.name);

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
        $options: 'i',
      };
    }
    return this.permissionModel.find(filter);
  }

  async updatePermission(permission: PermissionUpdateDto) {
    const { originalName, newName } = permission;

    const permissionExists = await this.findPermissionByName(originalName);

    if (!permissionExists) {
      throw new ConflictException('Permission does not exist');
    }

    const permissionWithNewName = await this.findPermissionByName(newName);

    if (permissionWithNewName) {
      throw new ConflictException('Permission with new name already exists');
    }

    await this.permissionModel.updateOne({ name: originalName }, { name: newName });

    return this.permissionModel.findById(permissionExists._id);
  }

  async deletePermission(name: string) {
    const permissionExists = await this.findPermissionByName(name);

    if (!permissionExists) {
      throw new ConflictException('Permission does not exist');
    }

    return this.permissionModel.deleteOne({ name });
  }

  findPermissionByName(name: string) {
    return this.permissionModel.findOne({
      name,
    });
  }
}
