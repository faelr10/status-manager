import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  DiariaAllData,
  DiariaCreateInput,
  GestaoRepository,
} from './gestao.repository';
import { FuncionariosRepository } from 'src/funcionarios/funcionarios.repository';
import { formatDiarias } from 'src/helpers/formatDiarias';

@Injectable()
export class GestaoService {
  constructor(
    private readonly gestaoRepository: GestaoRepository,
    private readonly funcionarioRepository: FuncionariosRepository,
  ) {}

  async newDiaria(data: DiariaCreateInput) {
    const funcionario = await this.funcionarioRepository.exists({
      id: data.funcionarioId,
    });
    if (!funcionario) {
      throw new ForbiddenException('Funcionario not found');
    }

    if (data.obraId === 'falta') {
      console.log('teste');
      return this.gestaoRepository.newFalta({
        funcionarioId: data.funcionarioId,
        data: data.data,
      });
    }

    data.valorDiaria = funcionario.valorDiaria;
    data.valorHora = funcionario.valorHora;

    return this.gestaoRepository.create(data);
  }

  async listDiarias(): Promise<any> {
    const diarias = (await this.gestaoRepository.findAll()) as DiariaAllData[];
    const agrupado = formatDiarias(diarias);

    // Buscar faltas
    const faltas = await this.gestaoRepository.findAllFaltas();

    // Mapeamento auxiliar: funcionarioId -> nome
    const funcionariosMap: Record<string, string> = {};
    diarias.forEach((d) => {
      funcionariosMap[d.funcionario.id] = d.funcionario.name;
    });

    // Substituir ou criar "Falta" nos dias correspondentes
    for (const falta of faltas) {
      const nome = funcionariosMap[falta.funcionarioId];
      if (!nome) continue;

      // Ajuste para fuso horário
      const date = new Date(falta.data);
      const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000,
      );
      const dia = localDate.getDate().toString();

      // Se o dia não existir no agrupado, cria
      if (!agrupado[dia]) {
        agrupado[dia] = {};
      }

      // Marca como falta (sobrescreve ou cria)
      agrupado[dia][nome] = 'Falta';
    }

    return agrupado;
  }

  async listRelatoriosGerais(
    startDate?: string,
    endDate?: string,
  ): Promise<any[]> {
    let diarias: DiariaAllData[];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      diarias = (await this.gestaoRepository.findAll(
        start,
        end,
      )) as DiariaAllData[];
    } else {
      diarias = (await this.gestaoRepository.findAll()) as DiariaAllData[];
    }

    type DiariaAgrupada = {
      funcionario: string;
      funcionarioId: string;
      quantidadeDiarias: number;
      quantidadeHoras: number;
      valorTotal: number;
    };

    type ObraAgrupada = {
      id: string;
      name: string;
      diarias: DiariaAgrupada[];
    };

    type ConstrutoraAgrupada = {
      id: string;
      name: string;
      obras: ObraAgrupada[];
    };

    const result: ConstrutoraAgrupada[] = [];

    for (const diaria of diarias) {
      const { obra, funcionario, valorHora, quantHoras } = diaria;

      const construtoraId = obra.Construtora.id;
      const construtoraName = obra.Construtora.name;

      // percorre o acumulado e encontra ou cria a construtora que está no loop atual
      let construtora = result.find((c) => c.id === construtoraId);
      if (!construtora) {
        construtora = {
          id: construtoraId,
          name: construtoraName,
          obras: [],
        };
        result.push(construtora);
      }

      // percorre a construtora e encontra ou cria a obra dentro da construtora
      let obraExistente = construtora.obras.find((o) => o.id === obra.id);
      if (!obraExistente) {
        obraExistente = {
          id: obra.id,
          name: obra.name,
          diarias: [],
        };
        construtora.obras.push(obraExistente);
      }

      // Encontra ou cria o funcionário dentro da obra
      let funcionarioDiaria = obraExistente.diarias.find(
        (d) => d.funcionario === funcionario.name,
      );
      if (!funcionarioDiaria) {
        funcionarioDiaria = {
          funcionario: funcionario.name,
          funcionarioId: funcionario.id,
          quantidadeDiarias: 0,
          quantidadeHoras: 0,
          valorTotal: 0,
        };
        obraExistente.diarias.push(funcionarioDiaria);
      }

      const faltas = await this.gestaoRepository.findAllFaltasById({
        funcionarioId: funcionario.id,
      });

      let quantFaltas = 0;

      if (!faltas) {
        quantFaltas = 0;
      } else {
        quantFaltas = faltas.length;
      }

      // Atualiza os valores do funcionário
      funcionarioDiaria.quantidadeHoras += quantHoras;
      funcionarioDiaria.quantidadeDiarias += Number(
        (quantHoras / 8.8).toFixed(3),
      );

      if (quantFaltas >= 2) {
        funcionarioDiaria.valorTotal += valorHora * quantHoras - 20;
      } else {
        console.log(valorHora, quantHoras);

        funcionarioDiaria.valorTotal += valorHora * quantHoras;
      }
    }

    return result;
  }

  async findDiariaByFuncionario(id: string) {
    return this.gestaoRepository.findAllDiariasById({ funcionarioId: id });
  }
}
