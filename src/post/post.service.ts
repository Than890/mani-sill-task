import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { Role } from 'src/utilities/constant';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllByFilter(query: any): Promise<Post[]> {
    const { sub, organization_id, role } = query.user_info;
    let filter: any = {};
    if (role === Role.user) {
      filter = {
        user: {
          organization: {
            id: organization_id,
          },
        },
      };
    }
    return await this.prisma.post.findMany({
      where: filter,
    });
  }

  async getOneById(id: string, query: any): Promise<Post> {
    const filter = await this.ForbiddenException(id, query.user_info);
    return await this.prisma.post.findUnique({
      where: filter,
    });
  }

  async create(post: CreatePostDto): Promise<Post> {
    return await this.prisma.post.create({ data: post });
  }

  async update(id: string, post: UpdatePostDto, query: any): Promise<Post> {
    const filter = await this.ForbiddenException(id, query.user_info);
    return await this.prisma.post.update({
      where: filter,
      data: post,
    });
  }

  async delete(id: string, query: any): Promise<Post> {
    const filter = await this.ForbiddenException(id, query.user_info);
    return await this.prisma.post.delete({ where: filter });
  }

  async ForbiddenException(id: string, userInfo: any) {
    const { sub, role } = userInfo;
    let filter: any = { id: id };
    if (role === Role.user) {
      filter.user_id = sub;
    }
    const exitedRecord = await this.prisma.post.findUnique({
      where: filter,
    });
    if (!exitedRecord) {
      throw new ForbiddenException();
    }
    return filter;
  }
}
