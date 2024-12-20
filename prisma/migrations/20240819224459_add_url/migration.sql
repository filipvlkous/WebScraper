/*
  Warnings:

  - Added the required column `url` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Car_vin_idx" ON "Car"("vin");
