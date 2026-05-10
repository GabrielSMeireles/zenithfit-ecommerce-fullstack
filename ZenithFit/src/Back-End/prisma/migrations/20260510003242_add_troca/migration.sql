-- CreateTable
CREATE TABLE "Troca" (
    "cd_troca" SERIAL NOT NULL,
    "dt_solicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ds_motivo" TEXT NOT NULL,
    "ds_descricao" TEXT,
    "cd_status_troca" INTEGER NOT NULL DEFAULT 1,
    "cd_pedido" INTEGER NOT NULL,
    "cd_item" INTEGER,

    CONSTRAINT "Troca_pkey" PRIMARY KEY ("cd_troca")
);

-- CreateTable
CREATE TABLE "Status_troca" (
    "cd_status_troca" SERIAL NOT NULL,
    "nm_status" TEXT NOT NULL,

    CONSTRAINT "Status_troca_pkey" PRIMARY KEY ("cd_status_troca")
);

-- AddForeignKey
ALTER TABLE "Troca" ADD CONSTRAINT "Troca_cd_pedido_fkey" FOREIGN KEY ("cd_pedido") REFERENCES "Pedido"("cd_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Troca" ADD CONSTRAINT "Troca_cd_status_troca_fkey" FOREIGN KEY ("cd_status_troca") REFERENCES "Status_troca"("cd_status_troca") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Troca" ADD CONSTRAINT "Troca_cd_item_fkey" FOREIGN KEY ("cd_item") REFERENCES "Item_Pedido"("cd_item") ON DELETE SET NULL ON UPDATE CASCADE;
