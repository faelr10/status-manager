import { DiariaAllData } from 'src/gestao/gestao.repository';

export function formatDiarias(diarias: DiariaAllData[]) {
  // Set para evitar duplicatas de nomes de funcionários
  const funcionariosSet = new Set<string>();
  diarias.forEach((d) => funcionariosSet.add(d.funcionario.name));

  const funcionarios = Array.from(funcionariosSet);

  // Objeto final
  const resultado: Record<string, Record<string, string>> = {};

  diarias.forEach((d) => {
    // Normalizar a data para pegar só o dia
    const date = new Date(d.data);
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000,
    );
    const day = localDate.getDate().toString();

    // Inicializa o dia com todos os funcionários vazios
    if (!resultado[day]) {
      resultado[day] = {};
      funcionarios.forEach((f) => {
        resultado[day][f] = '';
      });
    }

    // Monta a string da obra com horas
    const obraComHoras = `${d.obra.name} - ${d.quantHoras}hrs`;

    // Se já existe valor para o funcionário, concatena com "|"
    if (resultado[day][d.funcionario.name]) {
      resultado[day][d.funcionario.name] += ` | ${obraComHoras}`;
    } else {
      resultado[day][d.funcionario.name] = obraComHoras;
    }
  });

  return resultado;
}
