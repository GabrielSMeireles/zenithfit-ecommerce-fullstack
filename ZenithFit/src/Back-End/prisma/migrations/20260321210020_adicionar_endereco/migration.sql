/*
  Warnings:

  - Added the required column `cd_cep` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cd_numero` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nm_bairro` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nm_cidade` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nm_logradouro` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sg_estado` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "cd_cep" TEXT NOT NULL,
ADD COLUMN     "cd_numero" TEXT NOT NULL,
ADD COLUMN     "nm_bairro" TEXT NOT NULL,
ADD COLUMN     "nm_cidade" TEXT NOT NULL,
ADD COLUMN     "nm_logradouro" TEXT NOT NULL,
ADD COLUMN     "sg_estado" TEXT NOT NULL;
