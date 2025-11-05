-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "bio" TEXT,
    "links" JSONB,
    "skills" TEXT[],
    "score" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastAnchorTx" TEXT,
    "lastAnchorBlk" INTEGER,
    "hashHex" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_address_key" ON "Profile"("address");
