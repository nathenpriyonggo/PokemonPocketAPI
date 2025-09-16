/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `roleID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `password` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "username",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "roleID" INTEGER NOT NULL,
DROP COLUMN "password",
ADD COLUMN     "password" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deck" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Card" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "previousState" TEXT,
    "nextStage" TEXT,
    "pack" TEXT NOT NULL,
    "gen" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "retreatCost" INTEGER NOT NULL,
    "rarity" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "weakness" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CardToDeck" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CardToDeck_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE INDEX "_CardToDeck_B_index" ON "public"."_CardToDeck"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Card" ADD CONSTRAINT "Card_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Card" ADD CONSTRAINT "Card_weakness_fkey" FOREIGN KEY ("weakness") REFERENCES "public"."Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CardToDeck" ADD CONSTRAINT "_CardToDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CardToDeck" ADD CONSTRAINT "_CardToDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
