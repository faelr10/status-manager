import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { CreateFuncionarioDto } from './dto/createFuncionario.dto';

@Controller('funcionarios')
export class FuncionariosController {
  constructor(
    @Inject(FuncionariosService)
    private readonly funcionariosService: FuncionariosService,
  ) {}

  @Post()
  create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionariosService.newFuncionario(createFuncionarioDto);
  }

  @Get()
  findAll() {
    return this.funcionariosService.listFuncionarios();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.funcionariosService.findFuncionario(id);
  }
}
