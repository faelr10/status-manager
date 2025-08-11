import { Module } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { ObrasController } from './obras.controller';
import { ObrasService } from './obras.service';
import { ObrasRepository } from './obras.repository';

@Module({
  imports: [],
  controllers: [ObrasController],
  providers: [ObrasService, ObrasRepository, PrismaClient],
})
export class ObrasModule {}
