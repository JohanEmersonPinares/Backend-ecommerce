/*
  Warnings:

  - Changed the type of `sizes` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `bestseller` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sizes",
ADD COLUMN     "sizes" JSONB NOT NULL,
ALTER COLUMN "bestseller" SET NOT NULL,
ALTER COLUMN "date" SET DATA TYPE BIGINT;
