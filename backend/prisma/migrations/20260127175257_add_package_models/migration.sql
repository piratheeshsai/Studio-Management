-- CreateEnum
CREATE TYPE "PackageCategory" AS ENUM ('WEDDING', 'BIRTHDAY', 'COMMERCIAL', 'CORPORATE', 'MATERNITY', 'PRE_WEDDING', 'ENGAGEMENT', 'BABY_SHOWER', 'OTHER');

-- CreateEnum
CREATE TYPE "PackageItemType" AS ENUM ('PRODUCT', 'EVENT');

-- CreateTable
CREATE TABLE "packages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category" "PackageCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "package_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PackageItemType" NOT NULL,
    "def_dimensions" TEXT,
    "def_pages" INTEGER,
    "def_quantity" INTEGER DEFAULT 1,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
