-- CreateTable
CREATE TABLE "ProductViews" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductViews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductViews_productId_idx" ON "ProductViews"("productId");

-- AddForeignKey
ALTER TABLE "ProductViews" ADD CONSTRAINT "ProductViews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
