import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { RolesService } from '../roles/roles.service';
import { UserDto } from './dto/user.dto';
import { UserRoleDto } from './dto/user-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService
  ) {}

  findUserByEmail(email: string) {
    return this.userModel
      .findOne({
        email,
      })
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });
  }

  findUserByUserCode(userCode: number) {
    return this.userModel
      .findOne({
        userCode,
      })
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });
  }

  async createUser(user: UserDto) {
    const userExists = await this.findUserByEmail(user.email);

    if (userExists) {
      throw new ConflictException(`User with email ${user.email} already exists`);
    }

    let roleId: Types.ObjectId = null;

    if (user.role) {
      const roleExists = await this.rolesService.findRoleByName(user.role.name);

      if (!roleExists) {
        throw new ConflictException(`El rol ${user.role.name} no existe`);
      } else {
        roleId = roleExists._id;
      }
    }
    const nUsers = await this.userModel.countDocuments();
    const userCode = nUsers + 1;

    const u = new this.userModel({
      ...user,
      userCode,
      role: roleId,
    });

    await u.save();

    return this.findUserByEmail(user.email);
  }

  async getUsers(page: number, size: number, sortBy: string, sort: string, deleted?: boolean) {
    const skip = (page - 1) * size;

    let findQuery = {};

    if (deleted !== undefined) {
      findQuery = {
        deleted,
      };
    }

    const total = await this.userModel.countDocuments(findQuery);

    const totalPages = Math.ceil(total / size);


    let sortQuery = {};

    if (sortBy && sort) {
      sortQuery = {
        [sortBy]: sort,
      };
    } else {
      sortQuery = {
        createdAt: 'desc',
      };
    }

    const users: User[] = await this.userModel
      .find(findQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(size)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });

    return {
      data: users,
      page,
      size,
      total,
      totalPages,
    };
  }

  async updateUser(userCode: number, user: UserDto) {
    const userExists = await this.findUserByUserCode(userCode);

    if (!userExists) {
      throw new ConflictException(`User with userCode ${userCode} does not exist`);
    }

    if (user.email) {
      const emailExists = await this.findUserByEmail(user.email);

      if (emailExists && userExists.email !== user.email) {
        throw new ConflictException(`Email ${user.email} is already in use`);
      }
    }

    let roleId: Types.ObjectId = null;

    if (user.role) {
      const roleExists = await this.rolesService.findRoleByName(user.role.name);

      if (!roleExists) {
        throw new ConflictException(`Role ${user.role.name} does not exist`);
      } else {
        roleId = roleExists._id;
      }
    }

    await userExists.updateOne({
      ...user,
      role: roleId,
    });

    return this.findUserByUserCode(userCode);
  }

  async addRoleToUser(userCode: number, userRole: UserRoleDto) {
    const userExists = await this.findUserByUserCode(userCode);

    if (!userExists) {
      throw new ConflictException(`User with userCode ${userCode} does not exist`);
    }

    if (userExists.role) {
      throw new ConflictException(`User with userCode ${userCode} already has a role`);
    }

    const roleExists = await this.rolesService.findRoleByName(userRole.roleName);

    if (!roleExists) {
      throw new ConflictException(`Role ${userRole.roleName} does not exist`);
    }

    await userExists.updateOne({
      role: roleExists._id,
    });

    return this.findUserByUserCode(userCode);
  }

  async removeRoleFromUser(userCode: number, userRole: UserRoleDto) {
    const userExists = await this.findUserByUserCode(userCode);

    if (!userExists) {
      throw new ConflictException(`User with userCode ${userCode} does not exist`);
    }

    if (!userExists.role) {
      throw new ConflictException(`User with userCode ${userCode} does not have a role`);
    }

    const roleExists = await this.rolesService.findRoleByName(userRole.roleName);

    if (!roleExists) {
      throw new ConflictException(`Role ${userRole.roleName} does not exist`);
    }

    await userExists.updateOne({
      role: null,
    });

    return this.findUserByUserCode(userCode);
  }

  async deleteUser(userCode: number) {
    const userExists = await this.findUserByUserCode(userCode);

    if (!userExists) {
      throw new ConflictException(`User with userCode ${userCode} does not exist`);
    }

    if (userExists.deleted) {
      throw new ConflictException(`User with userCode ${userCode} is already deleted`);
    }

    await userExists.updateOne({
      deleted: true,
    });

    return this.findUserByUserCode(userCode);
  }

    async restoreUser(userCode: number) {
        const userExists = await this.findUserByUserCode(userCode);
    
        if (!userExists) {
        throw new ConflictException(`User with userCode ${userCode} does not exist`);
        }
    
        if (!userExists.deleted) {
        throw new ConflictException(`User with userCode ${userCode} is not deleted`);
        }
    
        await userExists.updateOne({
        deleted: false,
        });
    
        return this.findUserByUserCode(userCode);
    }

    async numbersUsers(roleName: string) {
        const usersWithRole = await this.userModel.aggregate([
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role',
                },
            },
            {
                $match: {
                    'role.name': roleName.trim().toUpperCase(),
                },
            },
            {
                $count: 'total',
            },
        ]);

        if (usersWithRole.length > 0) {
            return usersWithRole[0].total;
        } else {
            return 0;
        }

    }


}
