/*
  Warnings:

  - A unique constraint covering the columns `[shoot_code]` on the table `shoots` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "shoots" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "shoot_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "shoots_shoot_code_key" ON "shoots"("shoot_code");
