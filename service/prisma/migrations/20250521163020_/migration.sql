-- CreateTable
CREATE TABLE "PdfGroupAccessInvite" (
    "id" TEXT NOT NULL,
    "pdfId" TEXT NOT NULL,
    "invitedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdfGroupAccessInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PdfGroupAccessInvite" ADD CONSTRAINT "PdfGroupAccessInvite_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "Pdf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfGroupAccessInvite" ADD CONSTRAINT "PdfGroupAccessInvite_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
