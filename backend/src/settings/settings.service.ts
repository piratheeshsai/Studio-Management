import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    // Get or create default settings
    let settings = await this.prisma.studioSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await this.prisma.studioSettings.create({
        data: { id: 'default' },
      });
    }

    return settings;
  }

  async updateSettings(data: { enableCrewAssignment?: boolean }) {
    return this.prisma.studioSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        ...data,
      },
    });
  }
}
