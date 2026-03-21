/*
  Warnings:

  - You are about to drop the column `cd_cep` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `cd_numero` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nm_bairro` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nm_cidade` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nm_logradouro` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `sg_estado` on the `Cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "cd_cep",
DROP COLUMN "cd_numero",
DROP COLUMN "nm_bairro",
DROP COLUMN "nm_cidade",
DROP COLUMN "nm_logradouro",
DROP COLUMN "sg_estado";

-- CreateTable
CREATE TABLE "Endereco" (
    "cd_endereco" SERIAL NOT NULL,
    "cd_cep" TEXT NOT NULL,
    "nm_logradouro" TEXT NOT NULL,
    "cd_numero" TEXT NOT NULL,
    "nm_bairro" TEXT NOT NULL,
    "nm_cidade" TEXT NOT NULL,
    "sg_estado" TEXT NOT NULL,
    "nm_tipo" TEXT NOT NULL DEFAULT 'Residencial',
    "cd_cpf" TEXT NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("cd_endereco")
);

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_cd_cpf_fkey" FOREIGN KEY ("cd_cpf") REFERENCES "Cliente"("cd_cpf") ON DELETE RESTRICT ON UPDATE CASCADE;
