import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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

  //quero pegar o valor da quinzena como query
  @Get('/get-valor-funcionario/:id')
  async getValorFuncionario(
    @Param('id') id: string,
    @Query('quinzena') quinzena: string,
  ) {
    return await this.funcionariosService.getValorFuncionario(id, quinzena);
  }
}
