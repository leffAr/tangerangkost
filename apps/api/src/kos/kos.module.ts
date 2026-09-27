import { Module } from '@nestjs/common';
import { KosService } from './kos.service';
import { KosController } from './kos.controller';
import { KosImagesController } from './kos-images.controller';

@Module({
  controllers: [KosController, KosImagesController],
  providers: [KosService],
})
export class KosModule {}
