import { Injectable } from '@nestjs/common';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Organization } from '@prisma/client';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllByFilter(query: any): Promise<Organization[]> {
    return await this.prisma.organization.findMany({
      where: {},
    });
  }

  async getOneById(id: string): Promise<Organization> {
    return await this.prisma.organization.findUnique({
      where: { id: id },
    });
  }

  async create(organization: CreateOrganizationDto): Promise<Organization> {
    return await this.prisma.organization.create({ data: organization });
  }

  async update(
    id: string,
    organization: UpdateOrganizationDto,
  ): Promise<Organization> {
    return await this.prisma.organization.update({
      where: { id: id },
      data: organization,
    });
  }

  async delete(id: string): Promise<Organization> {
    return await this.prisma.organization.delete({ where: { id: id } });
  }
}
