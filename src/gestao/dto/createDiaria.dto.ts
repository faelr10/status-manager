import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DiariaCreateInput } from '../gestao.repository';
import { Type } from 'class-transformer';

export class CreateDiariaDto implements DiariaCreateInput {
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
}
