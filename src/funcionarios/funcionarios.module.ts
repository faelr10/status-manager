import { Module } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { FuncionariosController } from './funcionarios.controller';
import { FuncionariosService } from './funcionarios.service';
import { FuncionariosRepository } from './funcionarios.repository';
import { GestaoRepository } from 'src/gestao/gestao.repository';

@Module({
  imports: [],
  controllers: [FuncionariosController],
  providers: [
    FuncionariosService,
    FuncionariosRepository,
    GestaoRepository,
    PrismaClient,
  ],
})
export class FuncionariosModule {}
