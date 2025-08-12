import { Injectable } from '@nestjs/common';
import {
  FuncionariosCreateInput,
  FuncionariosRepository,
} from './funcionarios.repository';
import { NotFoundError } from 'rxjs';
import { GestaoRepository } from 'src/gestao/gestao.repository';

@Injectable()
export class FuncionariosService {
  constructor(
    private readonly funcionariosRepository: FuncionariosRepository,
    private readonly gestaoRepository: GestaoRepository,
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

  async getValorFuncionario(id: string) {
    const funcionario = await this.funcionariosRepository.exists({ id });
    if (!funcionario) {
      throw new NotFoundError('Funcionário não encontrado');
    }

    const diariasByUser = await this.gestaoRepository.findAllDiariasById({
      funcionarioId: id,
    });

    if (!diariasByUser || diariasByUser.length === 0) {
      return 0;
    }

    let totalValor = 0;
    diariasByUser.forEach((diaria) => {
      totalValor += diaria.valorDiaria;
    });

    const quantFaltas = 2;

    if (quantFaltas > 0) {
      totalValor -= diariasByUser.length * 20; // Subtrai 20 por falta
    }

    return totalValor;
  }
}
