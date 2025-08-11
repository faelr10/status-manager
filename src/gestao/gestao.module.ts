import { Module } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { GestaoController } from './gestao.controller';
import { GestaoService } from './gestao.service';
import { GestaoRepository } from './gestao.repository';
import { FuncionariosRepository } from 'src/funcionarios/funcionarios.repository';

@Module({
  imports: [],
  controllers: [GestaoController],
  providers: [
    GestaoService,
    GestaoRepository,
    FuncionariosRepository,
    PrismaClient,
  ],
})
export class GestaoModule {}
