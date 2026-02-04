/*
  Warnings:

  - You are about to drop the column `start_date` on the `shoots` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shoots" DROP COLUMN "start_date",
ADD COLUMN     "event_date" TIMESTAMP(3);
