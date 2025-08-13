import { Injectable } from '@nestjs/common';
import { Diaria, Faltas, PrismaClient } from 'generated/prisma';

export type DiariaCreateInput = {
  funcionarioId: string;
  obraId: string;
  data: Date;
  valorDiaria: number;
  valorHora: number;
  quantHoras: number;
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

  async findAll(startDate?: Date, endDate?: Date): Promise<any[]> {
    return this.prisma.diaria.findMany({
      include: {
        funcionario: true,
        obra: { include: { Construtora: true } },
      },
      where:
        startDate && endDate
          ? {
              data: {
                gte: startDate,
                lt: endDate,
              },
            }
          : undefined,
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
