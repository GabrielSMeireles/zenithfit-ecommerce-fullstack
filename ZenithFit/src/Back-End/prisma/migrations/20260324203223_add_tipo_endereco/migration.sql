/*
  Warnings:

  - You are about to drop the column `nm_tipo` on the `Endereco` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Endereco" DROP COLUMN "nm_tipo",
ADD COLUMN     "is_cobranca" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_entrega" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nm_identificacao" TEXT NOT NULL DEFAULT 'Casa';
