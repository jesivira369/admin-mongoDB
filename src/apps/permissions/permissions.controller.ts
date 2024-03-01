import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionDto } from './dto/permission.dto';
import { PermissionUpdateDto } from './dto/permissionUpdate.dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
    
    constructor(private readonly permissionsService: PermissionsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new permission' })
    @ApiResponse({ status: 201, description: 'The permission has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiBody({ 
        type: PermissionDto,
        description: 'Permission data',
        examples: {
            example: {
                value: {name: 'READ'}
            }
        }
     })
    createPermission(@Body() permissionDto: PermissionDto) {
        return this.permissionsService.createPermission(permissionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get permissions' })
    @ApiResponse({ status: 200, description: 'Return all permissions.' })
    @ApiResponse({ status: 409, description: 'No permissions found.' })
    @ApiQuery({ 
        name: 'name', 
        required: false,
        type: String,
        description: 'Filter by name'
     })
    getPermissions(@Query('name') name: string) {
        return this.permissionsService.getPermissions(name);
    }

    @Put()
    @ApiOperation({ summary: 'Update a permission' })
    @ApiResponse({ status: 200, description: 'The permission has been successfully updated.' })
    @ApiResponse({ status: 409, description: 'Permission not found.' })
    @ApiBody({ 
        type: PermissionUpdateDto,
        description: 'Permission data',
        examples: {
            example: {
                value: {originalName: 'READ', newName: 'WRITE'}
            }
        }
     })
    updatePermission(@Body() updatePermission: PermissionUpdateDto) {
        return this.permissionsService.updatePermission(updatePermission);
    }

    @Delete(':name')
    @ApiParam({ 
        name: 'name', 
        description: 'Permission name',
        type: String,
        required: true
     })
    @ApiOperation({ summary: 'Delete a permission' })
    @ApiResponse({ status: 200, description: 'The permission has been successfully deleted.' })
    @ApiResponse({ status: 409, description: 'Permission not found.' })
    deletePermission(@Param('name') name: string) {
        return this.permissionsService.deletePermission(name);
    }
}
