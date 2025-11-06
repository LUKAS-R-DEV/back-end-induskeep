/*
  Warnings:

  - Added the required column `createdById` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add column as nullable first
ALTER TABLE "Schedule" ADD COLUMN "createdById" UUID;

-- Step 2: Populate existing records with userId (assuming creator was the same as assigned technician)
UPDATE "Schedule" SET "createdById" = "userId" WHERE "createdById" IS NULL;

-- Step 3: Make column NOT NULL
ALTER TABLE "Schedule" ALTER COLUMN "createdById" SET NOT NULL;

-- Step 4: AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
