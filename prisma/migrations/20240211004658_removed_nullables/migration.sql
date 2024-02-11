/*
  Warnings:

  - Made the column `category` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startingDate` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endingDate` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startingTime` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endingTime` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "startingDate" SET NOT NULL,
ALTER COLUMN "endingDate" SET NOT NULL,
ALTER COLUMN "startingTime" SET NOT NULL,
ALTER COLUMN "endingTime" SET NOT NULL;
