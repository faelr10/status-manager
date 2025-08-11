import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObrasCreateInput } from '../obras.repository';

export class CreateObraDto implements ObrasCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  orcamento: number;

  @IsString()
  @IsNotEmpty()
  construtoraId: string;
}
