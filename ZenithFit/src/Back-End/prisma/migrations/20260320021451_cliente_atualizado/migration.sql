/*
  Warnings:

  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Cliente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nm_email]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cd_DDD` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cd_cpf` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cd_genero` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cd_senha` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cd_status` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cd_telefone` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cd_tipo_telefone` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_nascimento` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nm_email` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nm_identificacao_telefone` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nm_nome_cliente` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "cd_DDD" TEXT NOT NULL,
ADD COLUMN     "cd_cpf" TEXT NOT NULL,
ADD COLUMN     "cd_genero" INTEGER NOT NULL,
ADD COLUMN     "cd_rank_cliente" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cd_senha" TEXT NOT NULL,
ADD COLUMN     "cd_status" INTEGER NOT NULL,
ADD COLUMN     "cd_telefone" TEXT NOT NULL,
ADD COLUMN     "cd_tipo_telefone" INTEGER NOT NULL,
ADD COLUMN     "dt_nascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nm_email" TEXT NOT NULL,
ADD COLUMN     "nm_identificacao_telefone" TEXT NOT NULL,
ADD COLUMN     "nm_nome_cliente" TEXT NOT NULL,
ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("cd_cpf");

-- CreateTable
CREATE TABLE "Genero" (
    "cd_genero" SERIAL NOT NULL,
    "nm_genero" TEXT NOT NULL,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("cd_genero")
);

-- CreateTable
CREATE TABLE "Tipo_telefone" (
    "cd_tipo_telefone" SERIAL NOT NULL,
    "nm_tipo_telefone" TEXT NOT NULL,

    CONSTRAINT "Tipo_telefone_pkey" PRIMARY KEY ("cd_tipo_telefone")
);

-- CreateTable
CREATE TABLE "Status_cliente" (
    "cd_status" SERIAL NOT NULL,
    "nm_status" TEXT NOT NULL,

    CONSTRAINT "Status_cliente_pkey" PRIMARY KEY ("cd_status")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_nm_email_key" ON "Cliente"("nm_email");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_cd_genero_fkey" FOREIGN KEY ("cd_genero") REFERENCES "Genero"("cd_genero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_cd_tipo_telefone_fkey" FOREIGN KEY ("cd_tipo_telefone") REFERENCES "Tipo_telefone"("cd_tipo_telefone") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_cd_status_fkey" FOREIGN KEY ("cd_status") REFERENCES "Status_cliente"("cd_status") ON DELETE RESTRICT ON UPDATE CASCADE;
