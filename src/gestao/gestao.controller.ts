import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
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

  @Get('relatorios-gerais')
  listRelatoriosGerais() {
    return this.gestaoService.listRelatoriosGerais();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gestaoService.findDiariaByFuncionario(id);
  }
}
