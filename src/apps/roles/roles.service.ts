import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { Model, Types } from 'mongoose';
import { PermissionsService } from '../permissions/permissions.service';
import { RoleDto } from './dto/roles.dto';
import { PermissionDto } from '../permissions/dto/permission.dto';

@Injectable()
export class RolesService {

    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<Role>,
        private readonly permissionsService: PermissionsService
    ) {}

    findRoleByName(name: string) {
        return this.roleModel.findOne({ name });
    }

    async createRole(role: RoleDto) {
        const roleExists = await this.findRoleByName(role.name)

        if (roleExists) {
            throw new ConflictException('Role already exists');
        }

        const permissionsRoles: Types.ObjectId[] = [];

        if (role.permissions && role.permissions.length > 0) {
            for (const permission of role.permissions) {
                const permissionExists = await this.permissionsService.findPermissionByName(permission.name);

                if (!permissionExists) {
                    throw new ConflictException(`Permission ${permission.name} does not exist`);
                }

                permissionsRoles.push(permissionExists._id);
            }
        }

        const p = new this.roleModel({
            name: role.name,
            permissions: permissionsRoles
        });

        return p.save();
    }

    async getRoles(name: string) {
        const filter = {};
        if (name) {
            filter['name'] = {
                $regex: name,
                $options: 'i',
            };
        }
        return this.roleModel.find(filter).populate('permissions');
    }

    async updateRole(name: string, role: RoleDto) {
        const roleExists = await this.findRoleByName(name);

        if (!roleExists) {
            throw new ConflictException('Role does not exist');
        }

        if (name !== role.name) {
            const newRoleNameExists = await this.findRoleByName(role.name);
            if (newRoleNameExists) {
                throw new ConflictException(`Role with name ${role.name} already exists`);
            }
        }

        const permissionsRoles: Types.ObjectId[] = [];

        if (role.permissions && role.permissions.length > 0) {
            for (const permission of role.permissions) {
                const permissionExists = await this.permissionsService.findPermissionByName(permission.name);

                if (!permissionExists) {
                    throw new ConflictException(`Permission ${permission.name} does not exist`);
                }

                permissionsRoles.push(permissionExists._id);
            }
        }

        await roleExists.updateOne({ name: role.name, permissions: permissionsRoles });

        return this.roleModel.findOne({ name: role.name }).populate('permissions');
    }

    async addPermission(name: string, permission: PermissionDto) {
        const roleExists = await this.findRoleByName(name);

        if (!roleExists) {
            throw new ConflictException('Role does not exist');
        }

        const permissionExists = await this.permissionsService.findPermissionByName(permission.name);

        if (!permissionExists) {
            throw new ConflictException(`Permission ${permission.name} does not exist`);
        }

        if (roleExists.permissions.includes(permissionExists._id)) {
            throw new ConflictException(`Role ${name} already has the permission ${permission.name}`);
        }

       await roleExists.updateOne({ $push: { permissions: permissionExists._id } });

        return this.roleModel.findOne({ name }).populate('permissions');
    }

    async removePermission(name: string, permission: PermissionDto) {
        const roleExists = await this.findRoleByName(name);

        if (!roleExists) {
            throw new ConflictException('Role does not exist');
        }

        const permissionExists = await this.permissionsService.findPermissionByName(permission.name);

        if (!permissionExists) {
            throw new ConflictException(`Permission ${permission.name} does not exist`);
        }

        if (!roleExists.permissions.includes(permissionExists._id)) {
            throw new ConflictException(`Role ${name} does not have the permission ${permission.name}`);
        }

        await roleExists.updateOne({ $pull: { permissions: permissionExists._id } });

        return this.roleModel.findOne({ name }).populate('permissions');
    }

    async deleteRole(name: string) {
        const roleExists = await this.findRoleByName(name);

        if (!roleExists) {
            throw new ConflictException('Role does not exist');
        }

        return roleExists.deleteOne();
    }

}
