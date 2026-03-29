/*
  Warnings:

  - Added the required column `cd_modalidade` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item_Pedido" ADD COLUMN     "nm_tamanho" TEXT;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "cd_modalidade" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Modalidade_Frete" (
    "cd_modalidade" SERIAL NOT NULL,
    "nm_modalidade" TEXT NOT NULL,
    "vl_fixo" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Modalidade_Frete_pkey" PRIMARY KEY ("cd_modalidade")
);

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_cd_modalidade_fkey" FOREIGN KEY ("cd_modalidade") REFERENCES "Modalidade_Frete"("cd_modalidade") ON DELETE RESTRICT ON UPDATE CASCADE;
