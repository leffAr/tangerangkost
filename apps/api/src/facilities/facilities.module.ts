import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service.js';
import { FacilitiesController } from './facilities.controller.js';

@Module({
  providers: [FacilitiesService],
  controllers: [FacilitiesController],
})
export class FacilitiesModule {}
