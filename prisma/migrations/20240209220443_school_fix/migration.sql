/*
  Warnings:

  - You are about to drop the column `customerId` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `maxAssiged` on the `School` table. All the data in the column will be lost.
  - Added the required column `maxAssigned` to the `School` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `School` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `School` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quota` on table `School` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dropEnabled` on table `School` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timezone` on table `School` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "School" DROP COLUMN "customerId",
DROP COLUMN "maxAssiged",
ADD COLUMN     "maxAssigned" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "quota" SET NOT NULL,
ALTER COLUMN "dropEnabled" SET NOT NULL,
ALTER COLUMN "timezone" SET NOT NULL;
