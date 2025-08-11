import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FuncionariosCreateInput } from '../funcionarios.repository';

export class CreateFuncionarioDto implements FuncionariosCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  valorDiaria: number;
}
