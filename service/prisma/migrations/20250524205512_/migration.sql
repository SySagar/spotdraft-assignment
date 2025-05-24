-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pdfId_fkey";

-- DropForeignKey
ALTER TABLE "Pdf" DROP CONSTRAINT "Pdf_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "SharedLink" DROP CONSTRAINT "SharedLink_pdfId_fkey";

-- AlterTable
ALTER TABLE "Pdf" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedLink" ADD CONSTRAINT "SharedLink_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "Pdf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "Pdf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
