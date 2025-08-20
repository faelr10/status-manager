import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async getValorFuncionario(id: string, quinzena: string) {
    const valor = {
      funcionario: '',
      quant_diarias: 0,
      valor_diaria: 0,
      desc_faltas: 0,
      desc_inss: 0,
      premio_producao: 0,
      valor_cesta: 0,
      valor_cafe_passagem: 0,
      valor_contra_cheque: 0,
      total_diaria: 0,
      total_sacar: 0,
      total_receber: 0,
    };
    //______________________________________________________________________________________

    //BUSCANDO DADOS DA QUINZENA BUSCADA
    // const quinzenaBusca = await this.findCurrentQuinzena();
    const quinzenaBusca =
      await this.gestaoRepository.getQuinzenaByRef(quinzena);

    if (!quinzenaBusca) {
      throw new ForbiddenException('Quinzena não encontrada');
    }
    //______________________________________________________________________________________

    //BUSCANDO DADOS DO USUÁRIO NA QUINZENA BUSCADA
    const usuarioQuinzena = await this.gestaoRepository.getQuinzenaByUsuario(
      id,
      quinzenaBusca?.ref_periodo,
    );

    //______________________________________________________________________________________

    //BUSCANDO USUÁRIO
    const funcionario = await this.funcionariosRepository.exists({ id });
    if (!funcionario) {
      throw new NotFoundError('Funcionário não encontrado');
    }

    //______________________________________________________________________________________

    //BUSCANDO DADOS DIÁRIAS
    // const diariasByUser = await this.gestaoRepository.findAllDiariasById({
    //   funcionarioId: id,
    // });

    const start = new Date(quinzenaBusca.start);
    start.setHours(0, 0, 0, 0); // início do dia no fuso local

    const end = new Date(quinzenaBusca.end);
    end.setHours(23, 59, 59, 999); // fim do dia no fuso local

    const diariasByUser = await this.gestaoRepository.findAllDiariasParams(
      id,
      start,
      end,
    );

    const datasDiarias = (diariasByUser ?? []).map(
      (diaria) => new Date(diaria.data).toISOString().split('T')[0],
    );
    const datasUnicas = Array.from(new Set(datasDiarias));

    console.log(datasUnicas);

    if (!diariasByUser || diariasByUser.length === 0) {
      return 0;
    }

    //______________________________________________________________________________________

    //INSS
    let valorInss = 0;
    if (funcionario.cargo == 'Bombeiro' && quinzenaBusca.ref_mes == '1') {
      valorInss = 200.88;
    } else if (funcionario.cargo == 'Ajudante') {
      valorInss = 192.2;
    }

    //______________________________________________________________________________________

    //CESTA
    let valorCesta = 0;
    if (!funcionario.possuiCesta && quinzenaBusca.ref_mes == '1') {
      valorCesta = 205.56;
    }

    //______________________________________________________________________________________

    //TOTAL DIÁRIA
    let totalDiaria = 0;
    diariasByUser.forEach((diaria) => {
      totalDiaria += diaria.valorDiaria;
    });
    //calculando valor total diaria
    const valorTotalDiarias =
      (totalDiaria / diariasByUser.length) * datasUnicas.length;

    //______________________________________________________________________________________

    //buscando faltas
    const faltas =
      (await this.gestaoRepository.findAllFaltasById({
        funcionarioId: id,
      })) ?? [];
    const quantFaltas = faltas.length;

    //Removendo 20$ de cada diaria por punição falta
    let total_desconto_faltas = 0;
    if (quantFaltas > 0) {
      total_desconto_faltas = datasUnicas.length * 20;
    }

    //______________________________________________________________________________________

    //RETORNO
    valor.funcionario = funcionario.name;

    valor.quant_diarias = datasUnicas.length;
    valor.valor_diaria = funcionario.valorDiaria;
    valor.total_diaria = valorTotalDiarias;

    valor.desc_faltas = total_desconto_faltas;
    valor.desc_inss = valorInss;

    valor.premio_producao = usuarioQuinzena?.bonificacao || 0;
    valor.valor_cesta = valorCesta;
    valor.valor_cafe_passagem = usuarioQuinzena?.cafePassagem || 0;

    valor.total_receber =
      valorTotalDiarias -
      total_desconto_faltas +
      valor.valor_cesta +
      valor.valor_cafe_passagem +
      valor.premio_producao -
      valor.desc_inss;

    valor.valor_contra_cheque = usuarioQuinzena?.valorContraCheque || 0;

    valor.total_sacar = usuarioQuinzena?.valorContraCheque
      ? valor.total_receber - usuarioQuinzena.valorContraCheque
      : valor.total_receber;

    return valor;
  }

  // private async findCurrentQuinzena() {
  //   const current_quinzena =
  //     await this.gestaoRepository.getAllCurrentQuinzena();
  //   let quinzenaBusca: ListaQuinzenas | undefined;
  //   for (const quinzena of current_quinzena) {
  //     const [start, end] = quinzena.ref_periodo.split(' | ').map((date) => {
  //       const [day, month, year] = date.split('/');
  //       return new Date(`${year}-${month}-${day}T00:00:00`);
  //     });
  //     const hoje = new Date();
  //     if (start <= hoje && end >= hoje) {
  //       quinzenaBusca = quinzena;
  //       break;
  //     }
  //   }

  //   if (!quinzenaBusca) {
  //     throw new ForbiddenException('Quinzena não encontrada');
  //   }

  //   return quinzenaBusca;
  // }
}
