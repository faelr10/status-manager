import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFuncionarioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  valorDiaria: number;

  @IsNumber()
  valorHora: number = 0;
}
