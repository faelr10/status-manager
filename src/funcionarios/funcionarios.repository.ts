import { Injectable } from '@nestjs/common';
import { Funcionarios, PrismaClient } from 'generated/prisma';

export type FuncionariosCreateInput = {
  name: string;
  valorDiaria: number;
};

@Injectable()
export class FuncionariosRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(data: FuncionariosCreateInput): Promise<Funcionarios> {
    return this.prisma.funcionarios.create({
      data,
    });
  }

  async findAll(): Promise<Funcionarios[]> {
    return this.prisma.funcionarios.findMany();
  }

  exists(where: Partial<Funcionarios>): Promise<Funcionarios | null> {
    return this.prisma.funcionarios.findFirst({
      where,
    });
  }
}
