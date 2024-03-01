import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put, 
    Query, 
    Patch, 
    HttpCode, 
    HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConflictResponse, ApiBody } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/roles.dto';
import { PermissionDto } from '../permissions/dto/permission.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new role' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The role has been successfully created.' })
    @ApiConflictResponse({ description: 'Role already exists.' }) // In case of conflict
    @ApiBody({ type: RoleDto, examples: {
        'example-1': {
            summary: 'Example Role',
            value: {
                name: 'Admin',
                permissions: [{ name: 'create-user' }, { name: 'delete-user' }]
            }
        }
    }})
    createRole(@Body() role: RoleDto) {
        return this.rolesService.createRole(role);
    }

    @Get()
    @ApiOperation({ summary: 'Get all roles or filter by name' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of roles' })
    getRoles(@Query('name') name: string){
        return this.rolesService.getRoles(name);
    }

    @Put('/:name')
    @ApiOperation({ summary: 'Update a role by name' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The role has been successfully updated.' })
    @ApiConflictResponse({ description: 'Role name already exists.' }) // In case of conflict
    updateRole(@Body() role: RoleDto, @Param('name') name: string){
        return this.rolesService.updateRole(name, role);
    }

    @Patch('/addPermission/:name')
    @ApiOperation({ summary: 'Add a permission to a role' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Permission has been added to the role.' })
    @ApiConflictResponse({ description: 'Role already has the permission.' }) // In case of conflict
    addPermission(@Body() permission: PermissionDto, @Param('name') name: string){
        return this.rolesService.addPermission(name, permission);
    }

    @Patch('/removePermission/:name')
    @ApiOperation({ summary: 'Remove a permission from a role' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Permission has been removed from the role.' })
    removePermission(@Body() permission: PermissionDto, @Param('name') name: string){
        return this.rolesService.removePermission(name, permission);
    }

    @Delete('/:name')
    @ApiOperation({ summary: 'Delete a role by name' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The role has been successfully deleted.' })
    deleteRole(@Param('name') name: string){
        return this.rolesService.deleteRole(name);
    }
}
