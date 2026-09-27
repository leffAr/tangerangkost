import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, kosId: string, createRoomDto: CreateRoomDto) {
    const kos = await this.prisma.kos.findUnique({
      where: { id: kosId },
      include: { owner: true },
    });

    if (!kos) throw new NotFoundException('Kos not found');
    if (kos.owner.userId !== userId)
      throw new ForbiddenException('Not authorized');

    return this.prisma.room.create({
      data: {
        ...createRoomDto,
        kosId,
      },
    });
  }

  async update(userId: string, id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { kos: { include: { owner: true } } },
    });

    if (!room) throw new NotFoundException('Room not found');
    if (room.kos.owner.userId !== userId)
      throw new ForbiddenException('Not authorized');

    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(userId: string, id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { kos: { include: { owner: true } } },
    });

    if (!room) throw new NotFoundException('Room not found');
    if (room.kos.owner.userId !== userId)
      throw new ForbiddenException('Not authorized');

    return this.prisma.room.delete({ where: { id } });
  }
}
