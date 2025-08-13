import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiariaDto {
  @IsString()
  @IsNotEmpty()
  funcionarioId: string;

  @IsNotEmpty()
  @IsString()
  obraId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  data: Date;

  @IsNumber()
  valorDiaria: number = 0;

  @IsNumber()
  quantHoras: number = 0;

  @IsNumber()
  valorHora: number = 0;
}
