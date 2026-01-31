import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @RequirePermissions('CLIENT_CREATE')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @RequirePermissions('CLIENT_READ')
  async findAll() {
    console.log('ClientsController.findAll called');
    try {
        const result = await this.clientsService.findAll();
        console.log('ClientsController.findAll success, count:', result.length);
        return result;
    } catch (error) {
        console.error('ClientsController.findAll error:', error);
        throw error;
    }
  }

  @Get(':id')
  @RequirePermissions('CLIENT_READ')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('CLIENT_UPDATE')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @RequirePermissions('CLIENT_DELETE')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
