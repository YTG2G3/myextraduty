-- AlterTable
ALTER TABLE "School" ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "startingTime" SET DATA TYPE TIME(3),
ALTER COLUMN "endingTime" SET DATA TYPE TIME(3);
