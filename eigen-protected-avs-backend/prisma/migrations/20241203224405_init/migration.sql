-- CreateTable
CREATE TABLE "Operator" (
  "id" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "stake" BIGINT NOT NULL DEFAULT 0,
  "fraudCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operator_address_key" ON "Operator"("address");
