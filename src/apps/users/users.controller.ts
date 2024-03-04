import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { GreaterZeroPipe } from 'src/pipes/greater-zero/greater-zero.pipe';
import { UserRoleDto } from './dto/user-role.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    createUser(@Body() user: UserDto){
        return this.usersService.createUser(user);
    }

    @Get()
    getUsers(
        @Query('page', GreaterZeroPipe) page: number,
        @Query('size', GreaterZeroPipe) size: number,
        @Query('sortBy') sortBy: string,
        @Query('sort') sort: string,
        @Query('deleted') deleted: boolean
    ){
        return this.usersService.getUsers(page, size, sortBy, sort, deleted);
    }

    @Put('/:usercode')
    updateUser(@Param('usercode') userCode: number, @Body() user: UserDto){
        return this.usersService.updateUser(userCode, user);
    }

    @Patch('/add-role/:usercode')
    addRoleToUser(@Param('usercode') userCode: number, @Body() userRole: UserRoleDto){
        return this.usersService.addRoleToUser(userCode, userRole);
    }

    @Patch('/remove-role/:usercode')
    removeRoleFromUser(@Param('usercode') userCode: number, @Body() userRole: UserRoleDto){
        return this.usersService.removeRoleFromUser(userCode, userRole);
    }

    @Delete('/:usercode')
    deleteUser(@Param('usercode') userCode: number){
        return this.usersService.deleteUser(userCode);
    }

    @Patch('/restore/:usercode')
    restoreUser(@Param('usercode') userCode: number){
        return this.usersService.restoreUser(userCode);
    }

}
