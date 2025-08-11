import { DiariaAllData } from 'src/gestao/gestao.repository';

export function formatDiarias(diarias: DiariaAllData[]) {
  //Set evits duplicate funcionario names
  const funcionariosSet = new Set<string>();

  //percorre o array e add o nome do funcionario no set - set nao permite duplicatas
  diarias.forEach((d) => funcionariosSet.add(d.funcionario.name));

  //converter para array
  const funcionarios = Array.from(funcionariosSet);

  //criar um objeto onde chave é string(dia) e o valor é um objeto com chave->nome dos funcionarios e valor->nome da obra
  const resultado: Record<string, Record<string, string>> = {};

  diarias.forEach((d) => {
    //pegar o dia da diaria
    const date = new Date(d.data);
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000,
    );
    const day = localDate.getDate().toString();

    //verifica se o dia ja existe no objeto resultado
    if (!resultado[day]) {
      //se nao existir, cria um novo objeto para aquele dia
      resultado[day] = {};

      //pegar todos funcionarios e add à aquele dia, mas sem atribuir obra ainda
      funcionarios.forEach((f) => {
        resultado[day][f] = '';
      });
    }

    resultado[day][d.funcionario.name] = d.obra.name;

    for (const [funcionario, obra] of Object.entries(resultado[day])) {
      if (obra === '') {
        resultado[day][funcionario] = 'Falta';
      }
    }
  });

  return resultado;
}
