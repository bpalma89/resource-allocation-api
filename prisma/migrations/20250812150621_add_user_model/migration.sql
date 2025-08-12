/*
  Warnings:

  - You are about to drop the column `created_by` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `modified_by` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `modified_by` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `modified_by` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `modified_by` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Allocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Allocation" DROP COLUMN "created_by",
DROP COLUMN "modified_by",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "modifiedById" TEXT;

-- AlterTable
ALTER TABLE "public"."Position" DROP COLUMN "created_by",
DROP COLUMN "modified_by",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "modifiedById" TEXT;

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "created_by",
DROP COLUMN "modified_by",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "modifiedById" TEXT;

-- AlterTable
ALTER TABLE "public"."Resource" DROP COLUMN "created_by",
DROP COLUMN "modified_by",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "modifiedById" TEXT;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_on" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Position" ADD CONSTRAINT "Position_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Position" ADD CONSTRAINT "Position_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resource" ADD CONSTRAINT "Resource_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resource" ADD CONSTRAINT "Resource_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Allocation" ADD CONSTRAINT "Allocation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Allocation" ADD CONSTRAINT "Allocation_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
