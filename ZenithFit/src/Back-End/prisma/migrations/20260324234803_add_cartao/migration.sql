-- CreateTable
CREATE TABLE "Cartao_credito" (
    "cd_cartao" SERIAL NOT NULL,
    "cd_numero_cartao" TEXT NOT NULL,
    "nm_nome_impresso_cartao" TEXT NOT NULL,
    "cd_seguranca" TEXT NOT NULL,
    "dt_validade_cartao" TIMESTAMP(3) NOT NULL,
    "cartao_preferencial" BOOLEAN NOT NULL DEFAULT false,
    "cd_bandeira" INTEGER NOT NULL,
    "cd_cpf" TEXT NOT NULL,

    CONSTRAINT "Cartao_credito_pkey" PRIMARY KEY ("cd_cartao")
);

-- CreateTable
CREATE TABLE "Bandeira_cartao" (
    "cd_bandeira" SERIAL NOT NULL,
    "nm_bandeira" TEXT NOT NULL,

    CONSTRAINT "Bandeira_cartao_pkey" PRIMARY KEY ("cd_bandeira")
);

-- AddForeignKey
ALTER TABLE "Cartao_credito" ADD CONSTRAINT "Cartao_credito_cd_bandeira_fkey" FOREIGN KEY ("cd_bandeira") REFERENCES "Bandeira_cartao"("cd_bandeira") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cartao_credito" ADD CONSTRAINT "Cartao_credito_cd_cpf_fkey" FOREIGN KEY ("cd_cpf") REFERENCES "Cliente"("cd_cpf") ON DELETE CASCADE ON UPDATE CASCADE;
