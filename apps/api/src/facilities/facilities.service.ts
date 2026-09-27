import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Injectable()
export class FacilitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createFacilityDto: CreateFacilityDto) {
    const existing = await this.prisma.facility.findUnique({
      where: { name: createFacilityDto.name },
    });
    if (existing) throw new ConflictException('Facility already exists');

    return this.prisma.facility.create({
      data: createFacilityDto,
    });
  }

  findAll() {
    return this.prisma.facility.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
