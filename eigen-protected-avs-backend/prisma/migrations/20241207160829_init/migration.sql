/*
  Warnings:

  - You are about to drop the `Operator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Operator";

-- CreateTable
CREATE TABLE "operators" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "stake" BIGINT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFraud" BOOLEAN NOT NULL DEFAULT false,
    "fraudCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_events" (
    "id" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "proofId" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "isValid" BOOLEAN NOT NULL,

    CONSTRAINT "fraud_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "operators_address_key" ON "operators"("address");

-- AddForeignKey
ALTER TABLE "fraud_events" ADD CONSTRAINT "fraud_events_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
