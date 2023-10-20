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
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { Roles } from 'src/auth/roles.decrator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/utilities/constant';

@Controller('posts')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @Roles(Role.admin, Role.user)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ApiBearerAuth('JWT-auth')
  @ResponseMessage('success')
  async GetAllByFilter(@Query() query: any) {
    return this.postService.getAllByFilter(query);
  }

  @Get(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ApiBearerAuth('JWT-auth')
  @ResponseMessage('success')
  async GetOne(@Param('id') id: string, @Query() query: any) {
    return this.postService.getOneById(id, query);
  }

  @Post()
  @Roles(Role.admin, Role.user)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ApiBearerAuth('JWT-auth')
  @UsePipes(ValidationPipe)
  @ResponseMessage('New post has been successfully created.')
  async create(@Body() post: CreatePostDto) {
    return this.postService.create(post);
  }

  @Patch(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ApiBearerAuth('JWT-auth')
  @UsePipes(ValidationPipe)
  @ResponseMessage('Post has been successfully updated.')
  async update(
    @Param('id') id: string,
    @Body() post: UpdatePostDto,
    @Query() query: any,
  ) {
    return this.postService.update(id, post, query);
  }

  @Delete(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ApiBearerAuth('JWT-auth')
  @ResponseMessage('Post has been permanently deleted.')
  async delete(@Param('id') id: string, @Query() query: any) {
    return this.postService.delete(id, query);
  }
}
