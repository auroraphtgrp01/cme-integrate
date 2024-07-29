import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ExecuteModule } from './execute/execute.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ExecuteModule, ConfigModule.forRoot(
    {
      isGlobal: true,
    }
  )],
  controllers: [],
  providers: [AppService]
})
export class AppModule { }
