import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';


@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    try {
      return await this.prisma.client.create({
        data: createClientDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target && target.includes('email')) {
            throw new ConflictException('A client with this email already exists.');
        }
        if (target && target.includes('phone')) {
            throw new ConflictException('A client with this phone number already exists.');
        }
        throw new ConflictException('A client with this information already exists.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.client.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      return await this.prisma.client.update({
        where: { id },
        data: updateClientDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target && target.includes('email')) {
            throw new ConflictException('A client with this email already exists.');
        }
         if (target && target.includes('phone')) {
            throw new ConflictException('A client with this phone number already exists.');
        }
        throw new ConflictException('A client with this information already exists.');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.client.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }
}
