import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/appdb' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const role = await prisma.role.findUnique({
      where: { name: 'SUPER_ADMIN' },
      include: { permissions: true },
    });

    if (!role) {
      console.log('SUPER_ADMIN role not found!');
    } else {
      console.log('SUPER_ADMIN Permissions:');
      const slugs = role.permissions.map(p => p.slug);
      console.log(slugs.join(', '));
      
      if (slugs.includes('CLIENT_CREATE')) {
        console.log('✅ CLIENT_CREATE is present.');
      } else {
        console.log('❌ CLIENT_CREATE is MISSING.');
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
