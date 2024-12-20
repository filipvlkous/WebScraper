/*
  Warnings:

  - You are about to drop the column `body` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `fuel` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `transmission` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "body",
DROP COLUMN "fuel",
DROP COLUMN "transmission",
DROP COLUMN "volume";
