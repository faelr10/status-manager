import { Injectable } from '@nestjs/common';
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
      throw new Error('Funcionario not found');
    }

    data.valorDiaria = funcionario.valorDiaria;

    return this.gestaoRepository.create(data);
  }

  async listDiarias(): Promise<any> {
    const diarias = (await this.gestaoRepository.findAll()) as DiariaAllData[];
    const agrupado = formatDiarias(diarias);

    return agrupado;
  }

  async listRelatoriosGerais(): Promise<any[]> {
    const diarias = (await this.gestaoRepository.findAll()) as DiariaAllData[];

    type DiariaAgrupada = {
      funcionario: string;
      quantidadeDiarias: number;
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

    const result = diarias.reduce<ConstrutoraAgrupada[]>((acc, diaria) => {
      const { obra, funcionario, valorDiaria } = diaria;

      const construtoraId = obra.Construtora.id;
      const construtoraName = obra.Construtora.name;

      // Encontra ou cria a construtora
      let construtora = acc.find((c) => c.id === construtoraId);
      if (!construtora) {
        construtora = {
          id: construtoraId,
          name: construtoraName,
          obras: [],
        };
        acc.push(construtora);
      }

      // Encontra ou cria a obra dentro da construtora
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
          quantidadeDiarias: 0,
          valorTotal: 0,
        };
        obraExistente.diarias.push(funcionarioDiaria);
      }

      // Atualiza os valores do funcionário
      funcionarioDiaria.quantidadeDiarias += 1;
      funcionarioDiaria.valorTotal += valorDiaria;

      return acc;
    }, []);

    return result;
  }

  async findDiariaByFuncionario(id: string) {
    return this.gestaoRepository.findAllDiariasById({ funcionarioId: id });
  }
}
