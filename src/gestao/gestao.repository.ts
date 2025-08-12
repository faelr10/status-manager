import { Injectable } from '@nestjs/common';
import { Diaria, Faltas, PrismaClient } from 'generated/prisma';

export type DiariaCreateInput = {
  funcionarioId: string;
  obraId: string;
  data: Date;
  valorDiaria: number;
};

export type FaltasCreateInput = {
  funcionarioId: string;
  data: Date;
};

export type DiariaAllData = Diaria & {
  funcionario: {
    id: string;
    name: string;
    cpf: string;
    cargo: string;
    valorDiaria: number;
    createdAt: Date;
    updatedAt: Date;
  };
  obra: {
    id: string;
    name: string;
    orcamento: number;
    orcamentoGasto: number;
    orcamentoRestante: number;
    createdAt: Date;
    updatedAt: Date;
    Construtora: {
      id: string;
      name: string;
    };
  };
};

@Injectable()
export class GestaoRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(data: DiariaCreateInput): Promise<Diaria> {
    return this.prisma.diaria.create({
      data,
    });
  }

  async findAll(): Promise<any[]> {
    const start = new Date(
      Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1),
    );
    const end = new Date(
      Date.UTC(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    );

    return this.prisma.diaria.findMany({
      include: {
        funcionario: true,
        obra: { include: { Construtora: true } },
      },
      where: {
        data: {
          gte: start,
          lt: end,
        },
      },
    });
  }

  async findAllDiariasById(where: Partial<Diaria>): Promise<Diaria[] | null> {
    return this.prisma.diaria.findMany({
      where,
    });
  }

  async newFalta(data: FaltasCreateInput): Promise<Faltas> {
    return this.prisma.faltas.create({
      data,
    });
  }

  async findAllFaltas(): Promise<Faltas[]> {
    return this.prisma.faltas.findMany();
  }

  async findAllFaltasById(where: Partial<Faltas>): Promise<Faltas[] | null> {
    return this.prisma.faltas.findMany({
      where,
    });
  }
}
