-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_cd_cpf_fkey";

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_cd_cpf_fkey" FOREIGN KEY ("cd_cpf") REFERENCES "Cliente"("cd_cpf") ON DELETE CASCADE ON UPDATE CASCADE;
