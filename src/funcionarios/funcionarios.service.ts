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
    const valorHora = (data.valorDiaria * 5) / 44;
    return this.funcionariosRepository.create({
      ...data,
      valorHora,
    });
  }

  async listFuncionarios() {
    return this.funcionariosRepository.findAll();
  }

  async findFuncionario(id: string) {
    return this.funcionariosRepository.exists({ id });
  }

  async getValorFuncionario(id: string) {
    const valor = {
      funcionario: '',
      quant_diarias: 0,
      valor_diaria: 0,
      total_diaria: 0,
      desc_faltas: 0,
      desc_inss: 0,
      premio_producao: 0,
      valor_cesta: 0,
      valor_cafe_passagem: 0,
      total_receber: 0,
    };

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

    let totalDiaria = 0;
    diariasByUser.forEach((diaria) => {
      totalDiaria += diaria.valorDiaria;
    });

    const quantFaltas = 0;

    let total_desconto_faltas = 0;
    if (quantFaltas > 0) {
      total_desconto_faltas = diariasByUser.length * 20;
    }

    valor.funcionario = funcionario.name;
    valor.quant_diarias = diariasByUser.length;
    valor.valor_diaria = funcionario.valorDiaria;
    valor.total_diaria = totalDiaria;
    valor.desc_faltas = total_desconto_faltas;
    valor.premio_producao = 200;
    valor.valor_cesta = 205.56;
    valor.valor_cafe_passagem = 0;
    valor.desc_inss = 200.88;
    valor.total_receber =
      totalDiaria -
      total_desconto_faltas +
      valor.valor_cesta +
      valor.valor_cafe_passagem +
      valor.premio_producao -
      valor.desc_inss;

    return valor;
  }
}
