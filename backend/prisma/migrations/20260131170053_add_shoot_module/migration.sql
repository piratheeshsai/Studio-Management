-- CreateEnum
CREATE TYPE "ShootStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ShootItemStatus" AS ENUM ('DESIGNING', 'PRINTING', 'READY', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CHEQUE');

-- CreateTable
CREATE TABLE "shoots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_id" UUID NOT NULL,
    "category" "PackageCategory" NOT NULL,
    "package_name" TEXT NOT NULL,
    "final_price" DECIMAL(10,2) NOT NULL,
    "status" "ShootStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shoots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shoot_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shoot_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PackageItemType" NOT NULL,
    "dimensions" TEXT,
    "pages" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "is_included" BOOLEAN NOT NULL DEFAULT true,
    "status" "ShootItemStatus" NOT NULL DEFAULT 'DESIGNING',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shoot_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shoot_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shoots" ADD CONSTRAINT "shoots_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shoot_items" ADD CONSTRAINT "shoot_items_shoot_id_fkey" FOREIGN KEY ("shoot_id") REFERENCES "shoots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_shoot_id_fkey" FOREIGN KEY ("shoot_id") REFERENCES "shoots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
