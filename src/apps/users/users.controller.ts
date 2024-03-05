import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { GreaterZeroPipe } from 'src/pipes/greater-zero/greater-zero.pipe';
import { UserRoleDto } from './dto/user-role.dto';
import { RoleDto } from '../roles/dto/roles.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 409, description: "The email already exist<br/> The role doesn't exist" })
  @ApiBody({
    type: UserDto,
    description: 'The user to be created',
    examples: {
      user: {
        value: {
          name: 'John Doe',
          email: 'john@gmail.com',
          birthDate: '1990-01-01',
          role: {
            name: 'Admin',
          },
        },
      },
    },
  })
  createUser(@Body() user: UserDto) {
    return this.usersService.createUser(user);
  }

  @Get()
  @ApiQuery({ name: 'page', required: true, description: 'Page number of the users list', example: 1, type: Number })
  @ApiQuery({ name: 'size', required: true, description: 'Number of users per page', example: 10, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort the users by',
    example: 'name',
    type: String,
  })
  @ApiQuery({ name: 'sort', required: false, description: 'Sort direction', example: 'ASC', type: String })
  @ApiQuery({
    name: 'deleted',
    required: false,
    description: 'Whether to include deleted users',
    example: false,
    type: Boolean,
  })
  @ApiOperation({ summary: 'Get a list of users' })
  @ApiResponse({ status: 200, description: 'The list of users has been successfully retrieved.' })
  @ApiResponse({ status: 204, description: 'No users found' })
  getUsers(
    @Query('page', GreaterZeroPipe) page: number,
    @Query('size', GreaterZeroPipe) size: number,
    @Query('sortBy') sortBy: string,
    @Query('sort') sort: string,
    @Query('deleted') deleted: boolean
  ) {
    return this.usersService.getUsers(page, size, sortBy, sort, deleted);
  }

  @Put('/:usercode')
  @ApiParam({ name: 'usercode', required: true, description: 'The user code', example: 1, type: Number })
  @ApiBody({
    type: UserDto,
    description: 'The user to be created',
    examples: {
      user: {
        value: {
          name: 'John Doe',
          email: 'john@gmail.com',
          birthDate: '1990-01-01',
          role: {
            name: 'Admin',
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 409, description: "The email already exist<br/> The role doesn't exist" })
  updateUser(@Param('usercode') userCode: number, @Body() user: UserDto) {
    return this.usersService.updateUser(userCode, user);
  }

  @Patch('/add-role/:usercode')
  @ApiParam({ name: 'usercode', required: true, description: 'The user code', example: 1, type: Number })
  @ApiBody({
    type: RoleDto,
    description: 'The role to be added to the user',
    examples: {
      role: {
        value: {
          roleName: 'Admin',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Add a role to a user' })
  @ApiResponse({ status: 200, description: 'The role has been successfully added to the user.' })
  @ApiResponse({ status: 409, description: "The role doesn't exist" })
  addRoleToUser(@Param('usercode') userCode: number, @Body() userRole: UserRoleDto) {
    return this.usersService.addRoleToUser(userCode, userRole);
  }

  @Patch('/remove-role/:usercode')
  @ApiParam({ name: 'usercode', required: true, description: 'The user code', example: 1, type: Number })
  @ApiBody({
    type: RoleDto,
    description: 'The role to be removed from the user',
    examples: {
      role: {
        value: {
          roleName: 'Admin',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiResponse({ status: 200, description: 'The role has been successfully removed from the user.' })
  @ApiResponse({ status: 409, description: "The role doesn't exist" })
  removeRoleFromUser(@Param('usercode') userCode: number, @Body() userRole: UserRoleDto) {
    return this.usersService.removeRoleFromUser(userCode, userRole);
  }

  @Delete('/:usercode')
  @ApiParam({ name: 'usercode', required: true, description: 'The user code', example: 1, type: Number })
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 409, description: 'The user does not exist' })
  deleteUser(@Param('usercode') userCode: number) {
    return this.usersService.deleteUser(userCode);
  }

  @Patch('/restore/:usercode')
  @ApiParam({ name: 'usercode', required: true, description: 'The user code', example: 1, type: Number })
  @ApiOperation({ summary: 'Restore a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully restored.' })
  @ApiResponse({ status: 409, description: 'The user does not exist' })
  restoreUser(@Param('usercode') userCode: number) {
    return this.usersService.restoreUser(userCode);
  }
}
