import { PartialType } from '@nestjs/swagger';
import { CreateKosDto } from './create-kos.dto';

export class UpdateKosDto extends PartialType(CreateKosDto) {}
