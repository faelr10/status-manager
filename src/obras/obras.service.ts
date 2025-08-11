import { Injectable } from '@nestjs/common';

import { ObrasCreateInput, ObrasRepository } from './obras.repository';

@Injectable()
export class ObrasService {
  constructor(private readonly obrasRepository: ObrasRepository) {}

  async newObra(data: ObrasCreateInput) {
    return this.obrasRepository.create(data);
  }

  async listObras() {
    return this.obrasRepository.findAll();
  }

  async findObra(id: string) {
    return this.obrasRepository.exists({ id });
  }
}
