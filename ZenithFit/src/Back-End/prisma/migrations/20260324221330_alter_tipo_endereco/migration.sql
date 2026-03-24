/*
  Warnings:

  - You are about to drop the column `is_cobranca` on the `Endereco` table. All the data in the column will be lost.
  - You are about to drop the column `is_entrega` on the `Endereco` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Endereco" DROP COLUMN "is_cobranca",
DROP COLUMN "is_entrega",
ADD COLUMN     "nm_tipo_endereco" TEXT NOT NULL DEFAULT 'Cobrança';
