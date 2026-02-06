import { PrismaService } from '../../prisma/prisma.service';
import { PackageCategory } from '../../generated/prisma/client';

/**
 * Maps PackageCategory enum to shoot code letter prefix
 */
function getCategoryLetter(category: PackageCategory): string {
  const categoryMap: Record<PackageCategory, string> = {
    WEDDING: 'W',
    BIRTHDAY: 'B',
    CORPORATE: 'C',
    COMMERCIAL: 'CM',
    MATERNITY: 'M',
    PRE_WEDDING: 'P',
    ENGAGEMENT: 'E',
    BABY_SHOWER: 'BS',
    OTHER: 'O',
  };
  
  return categoryMap[category] || 'O';
}

/**
 * Generates the next sequential shoot code for a given category
 * Format: {Letter}-{Number} where number is 2-digit padded for 1-99, dynamic for 100+
 * Examples: W-01, W-42, W-100, CM-01, BS-15
 */
export async function generateShootCode(
  prisma: PrismaService,
  category: PackageCategory
): Promise<string> {
  const letter = getCategoryLetter(category);
  
  // Find the highest shoot code for this category prefix
  // Include soft-deleted shoots to ensure no number reuse
  const lastShoot = await prisma.shoot.findFirst({
    where: {
      shootCode: {
        startsWith: letter + '-',
      },
    },
    orderBy: {
      shootCode: 'desc',
    },
    select: {
      shootCode: true,
    },
  });
  
  // Extract the number from the last shoot code
  let nextNumber = 1;
  if (lastShoot?.shootCode) {
    const parts = lastShoot.shootCode.split('-');
    if (parts.length === 2) {
      const lastNumber = parseInt(parts[1], 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
  }
  
  // Format the number with dynamic padding:
  // 1-99: 2-digit padding (01, 02, ..., 99)
  // 100+: no padding (100, 101, ...)
  const paddedNumber = nextNumber < 100 
    ? nextNumber.toString().padStart(2, '0')
    : nextNumber.toString();
  
  return `${letter}-${paddedNumber}`;
}
