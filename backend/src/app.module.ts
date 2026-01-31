import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PackagesModule } from './packages/packages.module';
import { ClientsModule } from './clients/clients.module';
import { ShootsModule } from './shoots/shoots.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PackagesModule,
    ClientsModule,
    ShootsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
