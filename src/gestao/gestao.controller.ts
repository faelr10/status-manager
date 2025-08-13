import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GestaoService } from './gestao.service';
import { CreateDiariaDto } from './dto/createDiaria.dto';

@Controller('gestao')
export class GestaoController {
  constructor(
    @Inject(GestaoService)
    private readonly gestaoService: GestaoService,
  ) {}

  @Post()
  create(@Body() createNewDiaria: CreateDiariaDto) {
    return this.gestaoService.newDiaria(createNewDiaria);
  }

  @Get()
  findAll() {
    return this.gestaoService.listDiarias();
  }

  //adaptar para poder receber  ou nao startDate e endDate
  @Get('relatorios-gerais')
  listRelatoriosGerais(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.gestaoService.listRelatoriosGerais(startDate, endDate);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gestaoService.findDiariaByFuncionario(id);
  }
}
