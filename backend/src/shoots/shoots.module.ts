
import { Module } from '@nestjs/common';
import { ShootsService } from './shoots.service';
import { ShootsController } from './shoots.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShootsController],
  providers: [ShootsService],
})
export class ShootsModule {}
