/*
  Warnings:

  - Made the column `module` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `route` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `method` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statusCode` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "module" SET NOT NULL,
ALTER COLUMN "route" SET NOT NULL,
ALTER COLUMN "method" SET NOT NULL,
ALTER COLUMN "statusCode" SET NOT NULL;
