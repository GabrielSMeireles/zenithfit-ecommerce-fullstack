/*
  Warnings:

  - Added the required column `cd_categoria` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "cd_categoria" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Categoria" (
    "cd_categoria" SERIAL NOT NULL,
    "nm_categoria" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("cd_categoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nm_categoria_key" ON "Categoria"("nm_categoria");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_cd_categoria_fkey" FOREIGN KEY ("cd_categoria") REFERENCES "Categoria"("cd_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;
