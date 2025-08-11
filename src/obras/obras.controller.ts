import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ObrasService } from './obras.service';
import { CreateObraDto } from './dto/createObra.dto';

@Controller('obras')
export class ObrasController {
  constructor(
    @Inject(ObrasService)
    private readonly obrasService: ObrasService,
  ) {}

  @Post()
  create(@Body() createObraDto: CreateObraDto) {
    return this.obrasService.newObra(createObraDto);
  }

  @Get()
  findAll() {
    return this.obrasService.listObras();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.obrasService.findObra(id);
  }
}
