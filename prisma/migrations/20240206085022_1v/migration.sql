/*
  Warnings:

  - Added the required column `manager` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "manager" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
