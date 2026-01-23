/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// We can import these from our code or define them here.
// Defining here for simplicity in the seed script to avoid import issues during seed execution if build isn't ready.
const PERMISSIONS = [
  { name: 'Create User', slug: 'USER_CREATE' },
  { name: 'Read User', slug: 'USER_READ' },
  { name: 'Update User', slug: 'USER_UPDATE' },
  { name: 'Delete User', slug: 'USER_DELETE' },
];

const ROLES = {
  SUPER_ADMIN: ['USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE'],
  ADMIN: ['USER_CREATE', 'USER_READ', 'USER_UPDATE'],
  OWNER: ['USER_READ'],
  EDITOR: [],
  PHOTOGRAPHER: [],
};

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding Permissions...');
  const permissionMap = new Map();
  for (const p of PERMISSIONS) {
    const perm = await prisma.permission.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
    permissionMap.set(p.slug, perm);
  }

  console.log('Seeding Roles...');
  const roleMap = new Map();
  for (const [roleName, slugs] of Object.entries(ROLES)) {
    const permissionsToConnect = slugs.map((slug) => ({
      id: permissionMap.get(slug).id,
    }));

    // We disconnect all first to ensure the seed reflects exactly what's in permissionsToConnect
    // But for a simple upsert/create, we can just connect.
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {
        permissions: {
          set: [], // Clear existing relations
          connect: permissionsToConnect,
        },
      },
      create: {
        name: roleName,
        permissions: {
          connect: permissionsToConnect,
        },
      },
    });
    roleMap.set(roleName, role);
  }

  console.log('Seeding Admin User...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const superAdminRole = roleMap.get('SUPER_ADMIN');

  await prisma.user.upsert({
    where: { email: 'admin@studio.com' },
    update: {
      roleId: superAdminRole.id,
    },
    create: {
      email: 'admin@studio.com',
      name: 'Super Admin',
      password: hashedPassword,
      roleId: superAdminRole.id,
    },
  });

  console.log('Seed successful');
  await prisma.$disconnect();
}

void main();
