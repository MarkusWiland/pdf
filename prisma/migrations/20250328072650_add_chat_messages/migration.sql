-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdfFile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdfFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdfChunk" (
    "id" TEXT NOT NULL,
    "pdfId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdfChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdfSummary" (
    "id" TEXT NOT NULL,
    "pdfId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "PdfSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdfChatMessage" (
    "id" TEXT NOT NULL,
    "pdfId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdfChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PdfSummary_pdfId_key" ON "PdfSummary"("pdfId");

-- AddForeignKey
ALTER TABLE "PdfFile" ADD CONSTRAINT "PdfFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfChunk" ADD CONSTRAINT "PdfChunk_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "PdfFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfSummary" ADD CONSTRAINT "PdfSummary_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "PdfFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfChatMessage" ADD CONSTRAINT "PdfChatMessage_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "PdfFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
