-- AlterTable
ALTER TABLE "Troca" ADD COLUMN     "cd_cupom" INTEGER;

-- AddForeignKey
ALTER TABLE "Troca" ADD CONSTRAINT "Troca_cd_cupom_fkey" FOREIGN KEY ("cd_cupom") REFERENCES "Cupom"("cd_cupom") ON DELETE SET NULL ON UPDATE CASCADE;
