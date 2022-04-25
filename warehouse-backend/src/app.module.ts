import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import {
  localpostgresconfig,
  localsqliteconfig,
} from './Infrastructure/TypeORM/ormconfig';
import { PresentationModule } from './Presentation/presentation.module';

@Module({
  imports: [TypeOrmModule.forRoot(localsqliteconfig), PresentationModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
