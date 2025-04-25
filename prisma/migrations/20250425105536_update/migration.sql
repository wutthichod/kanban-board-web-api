/*
  Warnings:

  - The primary key for the `CardAssignee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cardId` on the `CardAssignee` table. All the data in the column will be lost.
  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taskId` to the `CardAssignee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_columnId_fkey";

-- DropForeignKey
ALTER TABLE "CardAssignee" DROP CONSTRAINT "CardAssignee_cardId_fkey";

-- AlterTable
ALTER TABLE "CardAssignee" DROP CONSTRAINT "CardAssignee_pkey",
DROP COLUMN "cardId",
ADD COLUMN     "taskId" INTEGER NOT NULL,
ADD CONSTRAINT "CardAssignee_pkey" PRIMARY KEY ("taskId", "userId");

-- DropTable
DROP TABLE "Card";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "columnId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardAssignee" ADD CONSTRAINT "CardAssignee_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
