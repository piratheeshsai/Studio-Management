
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ShootsService } from './shoots.service';
import { CreateShootDto } from './dto/create-shoot.dto';
import { ShootStatus, ShootItemStatus, PaymentMethod } from '../generated/prisma/client';

@Controller('shoots')
export class ShootsController {
  constructor(private readonly shootsService: ShootsService) {}

  @Post()
  create(@Body() createShootDto: CreateShootDto) {
    return this.shootsService.create(createShootDto);
  }

  @Get()
  findAll() {
    return this.shootsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.shootsService.findOne(id);
  }

  @Patch(':id')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body('status') status: ShootStatus) {
    return this.shootsService.updateStatus(id, status);
  }

  @Patch('items/:itemId')
  updateItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() body: { status?: ShootItemStatus; dimensions?: string; pages?: number; isIncluded?: boolean },
  ) {
    return this.shootsService.updateItem(itemId, body);
  }

  @Post(':id/payments')
  addPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { amount: number; method: PaymentMethod; note?: string; date?: string },
  ) {
    return this.shootsService.addPayment(id, body);
  }
}
