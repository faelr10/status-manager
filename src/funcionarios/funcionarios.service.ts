import { Injectable } from '@nestjs/common';
import {
  FuncionariosCreateInput,
  FuncionariosRepository,
} from './funcionarios.repository';

@Injectable()
export class FuncionariosService {
  constructor(
    private readonly funcionariosRepository: FuncionariosRepository,
  ) {}

  async newFuncionario(data: FuncionariosCreateInput) {
    return this.funcionariosRepository.create(data);
  }

  async listFuncionarios() {
    return this.funcionariosRepository.findAll();
  }

  async findFuncionario(id: string) {
    return this.funcionariosRepository.exists({ id });
  }
}
