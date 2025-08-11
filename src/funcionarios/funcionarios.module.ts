import { Module } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { FuncionariosController } from './funcionarios.controller';
import { FuncionariosService } from './funcionarios.service';
import { FuncionariosRepository } from './funcionarios.repository';

@Module({
  imports: [],
  controllers: [FuncionariosController],
  providers: [FuncionariosService, FuncionariosRepository, PrismaClient],
})
export class FuncionariosModule {}
