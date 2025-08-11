import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { ObrasModule } from './obras/obras.module';
import { GestaoModule } from './gestao/gestao.module';

@Module({
  imports: [FuncionariosModule, ObrasModule, GestaoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
