import { Module } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { GestaoController } from './gestao.controller';
import { GestaoService } from './gestao.service';
import { GestaoRepository } from './gestao.repository';
import { FuncionariosRepository } from 'src/funcionarios/funcionarios.repository';
import { FuncionariosService } from 'src/funcionarios/funcionarios.service';

@Module({
  imports: [],
  controllers: [GestaoController],
  providers: [
    GestaoService,
    GestaoRepository,
    FuncionariosService,
    FuncionariosRepository,
    PrismaClient,
  ],
})
export class GestaoModule {}
