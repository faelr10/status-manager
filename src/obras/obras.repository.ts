import { Injectable } from '@nestjs/common';
import { Obras, PrismaClient } from 'generated/prisma';

export type ObrasCreateInput = {
  name: string;
  orcamento: number;
  construtoraId: string;
};

@Injectable()
export class ObrasRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(data: ObrasCreateInput): Promise<Obras> {
    return this.prisma.obras.create({
      data,
    });
  }

  async findAll(): Promise<Obras[]> {
    return this.prisma.obras.findMany();
  }

  exists(where: Partial<Obras>): Promise<Obras | null> {
    return this.prisma.obras.findFirst({
      where,
    });
  }
}
