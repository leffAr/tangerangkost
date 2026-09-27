import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';
import { OwnerVerification } from '@prisma/client';

@Injectable()
export class KosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createKosDto: CreateKosDto) {
    const ownerProfile = await this.prisma.ownerProfile.findUnique({
      where: { userId },
    });

    if (!ownerProfile) {
      throw new ForbiddenException('Only owners can create Kos');
    }

    if (ownerProfile.verificationStatus !== OwnerVerification.VERIFIED) {
      throw new ForbiddenException('Akun Anda belum diverifikasi oleh Admin. Anda tidak dapat menambahkan kost baru sampai akun disetujui.');
    }

    const slug =
      createKosDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Date.now();

    const { facilities, ...kosData } = createKosDto;

    const kos = await this.prisma.kos.create({
      data: {
        ...kosData,
        slug,
        ownerId: ownerProfile.id,
      },
    });

    if (facilities && facilities.length > 0) {
      for (const facilityName of facilities) {
        // Upsert facility
        let facility = await this.prisma.facility.findUnique({
          where: { name: facilityName },
        });
        
        if (!facility) {
          facility = await this.prisma.facility.create({
            data: { name: facilityName },
          });
        }

        // Link to kos
        await this.prisma.kosFacility.create({
          data: {
            kosId: kos.id,
            facilityId: facility.id,
          },
        });
      }
    }

    return kos;
  }

  async findAll(query: any) {
    // Basic filtering implementation
    const where: any = {};
    if (query.priceMin) where.priceFrom = { gte: Number(query.priceMin) };
    if (query.priceMax) where.priceTo = { lte: Number(query.priceMax) };
    if (query.genderType) where.genderType = query.genderType;
    if (query.location) {
      where.OR = [
        { village: { contains: query.location } },
        { district: { contains: query.location } },
        { regency: { contains: query.location } },
        { address: { contains: query.location } }
      ];
    }

    const koses = await this.prisma.kos.findMany({
      where,
      include: {
        kosImages: { orderBy: { order: 'asc' } },
        owner: { include: { user: { select: { name: true, phone: true } } } }
      },
      orderBy: { createdAt: 'desc' },
    });

    if (query.lat && query.lng) {
      const userLat = Number(query.lat);
      const userLng = Number(query.lng);
      
      const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c; // Distance in km
      };

      koses.forEach((kos: any) => {
        if (kos.latitude && kos.longitude) {
          kos.distance = getDistance(userLat, userLng, kos.latitude, kos.longitude);
        } else {
          kos.distance = 999999;
        }
      });

      koses.sort((a: any, b: any) => a.distance - b.distance);
    }

    return koses;
  }

  async getPopularAreas() {
    return this.prisma.popularArea.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(slug: string) {
    const kos = await this.prisma.kos.findUnique({
      where: { slug },
      include: {
        kosImages: true,
        rooms: true,
        facilities: {
          include: { facility: true },
        },
        owner: {
          include: { user: { select: { name: true, phone: true } } },
        },
      },
    });

    if (!kos) throw new NotFoundException('Kos not found');
    return kos;
  }

  async update(userId: string, id: string, updateKosDto: UpdateKosDto) {
    const kos = await this.prisma.kos.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!kos) throw new NotFoundException('Kos not found');
    if (kos.owner.userId !== userId)
      throw new ForbiddenException('Not authorized');

    const { facilities, ...kosData } = updateKosDto;

    const updatedKos = await this.prisma.kos.update({
      where: { id },
      data: kosData,
    });

    if (facilities && facilities.length > 0) {
      // Clear existing facilities
      await this.prisma.kosFacility.deleteMany({
        where: { kosId: id },
      });

      for (const facilityName of facilities) {
        let facility = await this.prisma.facility.findUnique({
          where: { name: facilityName },
        });
        
        if (!facility) {
          facility = await this.prisma.facility.create({
            data: { name: facilityName },
          });
        }

        await this.prisma.kosFacility.create({
          data: {
            kosId: id,
            facilityId: facility.id,
          },
        });
      }
    }

    return updatedKos;
  }

  async remove(userId: string, id: string) {
    const kos = await this.prisma.kos.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!kos) throw new NotFoundException('Kos not found');
    if (kos.owner.userId !== userId)
      throw new ForbiddenException('Not authorized');

    return this.prisma.kos.delete({ where: { id } });
  }
}
