-- CreateTable
CREATE TABLE "Settings" (
    "id" UUID NOT NULL,
    "minStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "autoNotifyLowStock" BOOLEAN NOT NULL DEFAULT true,
    "defaultRepairDuration" INTEGER,
    "notificationEmail" TEXT,
    "maintenanceWindow" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_notificationEmail_key" ON "Settings"("notificationEmail");
