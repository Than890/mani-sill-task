import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/config/handlers/response-message';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationService } from './organization.service';
import { Roles } from 'src/auth/roles.decrator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/utilities/constant';

@Controller('organizations')
@ApiTags('Organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  @Roles(Role.admin)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ApiBearerAuth('JWT-auth')
  @ResponseMessage('success')
  async GetAllByFilter(@Query() query: any) {
    return this.organizationService.getAllByFilter(query);
  }

  @Get(':id')
  @Roles(Role.admin)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ResponseMessage('success')
  async GetOne(@Param('id') id: string) {
    return this.organizationService.getOneById(id);
  }

  @Post()
  @Roles(Role.admin)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  @ResponseMessage('New organization has been successfully created.')
  async create(@Body() organization: CreateOrganizationDto) {
    return this.organizationService.create(organization);
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  @ResponseMessage('Organization has been successfully updated.')
  async update(
    @Param('id') id: string,
    @Body() organization: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, organization);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ResponseMessage('Organization has been permanently deleted.')
  async delete(@Param('id') id: string) {
    return this.organizationService.delete(id);
  }
}
