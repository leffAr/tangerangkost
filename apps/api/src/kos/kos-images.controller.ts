import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Kos Images')
@Controller('kos/:kosId/images')
export class KosImagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image for a Kos (Owner only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBody({ schema: { type: 'object', properties: { url: { type: 'string' } } } })
  async uploadImage(
    @CurrentUser() user: User,
    @Param('kosId') kosId: string,
    @Body('url') url: string,
  ) {
    if (!url) throw new BadRequestException('Image URL is required');

    const kos = await this.prisma.kos.findUnique({
      where: { id: kosId },
      include: { owner: true },
    });

    if (!kos) throw new NotFoundException('Kos not found');
    if (kos.owner.userId !== user.id)
      throw new ForbiddenException('Not authorized');

    

    const existingImages = await this.prisma.kosImage.count({
      where: { kosId },
    });

    return this.prisma.kosImage.create({
      data: {
        kosId,
        url,
        isPrimary: existingImages === 0, // First image is primary
        order: existingImages,
      },
    });
  }

  @Post(':imageId/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image for a Kos (Owner only)' })
  async deleteImage(
    @CurrentUser() user: User,
    @Param('kosId') kosId: string,
    @Param('imageId') imageId: string,
  ) {
    const kos = await this.prisma.kos.findUnique({
      where: { id: kosId },
      include: { owner: true },
    });

    if (!kos) throw new NotFoundException('Kos not found');
    if (kos.owner.userId !== user.id)
      throw new ForbiddenException('Not authorized');

    const image = await this.prisma.kosImage.findFirst({
      where: { id: imageId, kosId },
    });

    if (!image) throw new NotFoundException('Image not found');

    await this.prisma.kosImage.delete({
      where: { id: imageId },
    });

    return { success: true, message: 'Image deleted' };
  }
}
