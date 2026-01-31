import { Controller, Get, Post, Put, Body, Param, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  async findAll() {
    return this.packagesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePackageDto: Partial<CreatePackageDto>) {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.packagesService.delete(id);
  }
}
