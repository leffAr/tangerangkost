import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { KosService } from './kos.service';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Kos')
@Controller('kos')
export class KosController {
  constructor(private readonly kosService: KosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new Kos (Owner only)' })
  create(@CurrentUser() user: User, @Body() createKosDto: CreateKosDto) {
    return this.kosService.create(user.id, createKosDto);
  }

  @Get()
  @ApiOperation({ summary: 'Search and list Kos' })
  findAll(@Query() query: any) {
    return this.kosService.findAll(query);
  }

  @Get('popular-areas')
  @ApiOperation({ summary: 'Get popular areas' })
  getPopularAreas() {
    return this.kosService.getPopularAreas();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get Kos details by slug' })
  findOne(@Param('slug') slug: string) {
    return this.kosService.findOne(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Kos (Owner only)' })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateKosDto: UpdateKosDto,
  ) {
    return this.kosService.update(user.id, id, updateKosDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Kos (Owner only)' })
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.kosService.remove(user.id, id);
  }
}
