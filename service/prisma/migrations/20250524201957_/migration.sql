/*
  Warnings:

  - You are about to drop the `PdfGroupAccessInvite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PdfGroupAccessInvite" DROP CONSTRAINT "PdfGroupAccessInvite_invitedId_fkey";

-- DropForeignKey
ALTER TABLE "PdfGroupAccessInvite" DROP CONSTRAINT "PdfGroupAccessInvite_pdfId_fkey";

-- DropTable
DROP TABLE "PdfGroupAccessInvite";

-- CreateTable
CREATE TABLE "_InvitedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InvitedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InvitedUsers_B_index" ON "_InvitedUsers"("B");

-- AddForeignKey
ALTER TABLE "_InvitedUsers" ADD CONSTRAINT "_InvitedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Pdf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitedUsers" ADD CONSTRAINT "_InvitedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
