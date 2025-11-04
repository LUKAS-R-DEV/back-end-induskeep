-- DropForeignKey
ALTER TABLE "public"."History" DROP CONSTRAINT "History_orderId_fkey";

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "MaintenanceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
