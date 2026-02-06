
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

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.shootsService.remove(id);
  }

  // ============================================
  // CREW ASSIGNMENT ENDPOINTS
  // ============================================

  @Post('items/:itemId/assignments')
  assignUser(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body('userId') userId: string,
  ) {
    return this.shootsService.assignUserToItem(itemId, userId);
  }

  @Delete('items/:itemId/assignments/:userId')
  unassignUser(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.shootsService.unassignUserFromItem(itemId, userId);
  }

  @Get('items/:itemId/assignments')
  getAssignments(@Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.shootsService.getItemAssignments(itemId);
  }

  @Patch('items/:itemId/details')
  updateItemDetails(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() body: { 
      status?: ShootItemStatus; 
      dimensions?: string; 
      pages?: number; 
      isIncluded?: boolean;
      eventDate?: string;
      location?: string;
    },
  ) {
    return this.shootsService.updateItemWithEventDetails(itemId, body);
  }
}
