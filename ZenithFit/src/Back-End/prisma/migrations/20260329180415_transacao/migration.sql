-- CreateTable
CREATE TABLE "Pedido" (
    "cd_pedido" SERIAL NOT NULL,
    "dt_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vl_total" DECIMAL(10,2) NOT NULL,
    "vl_frete" DECIMAL(10,2) NOT NULL,
    "cd_cpf" TEXT NOT NULL,
    "cd_endereco" INTEGER NOT NULL,
    "cd_status_pedido" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("cd_pedido")
);

-- CreateTable
CREATE TABLE "Item_Pedido" (
    "cd_item" SERIAL NOT NULL,
    "qt_item" INTEGER NOT NULL,
    "vl_unitario" DECIMAL(10,2) NOT NULL,
    "cd_pedido" INTEGER NOT NULL,
    "cd_produto" INTEGER NOT NULL,

    CONSTRAINT "Item_Pedido_pkey" PRIMARY KEY ("cd_item")
);

-- CreateTable
CREATE TABLE "Pagamento_Pedido" (
    "cd_pagamento" SERIAL NOT NULL,
    "vl_pago" DECIMAL(10,2) NOT NULL,
    "cd_pedido" INTEGER NOT NULL,
    "cd_cartao" INTEGER,

    CONSTRAINT "Pagamento_Pedido_pkey" PRIMARY KEY ("cd_pagamento")
);

-- CreateTable
CREATE TABLE "Cupom" (
    "cd_cupom" SERIAL NOT NULL,
    "nm_codigo" TEXT NOT NULL,
    "vl_desconto" DECIMAL(10,2) NOT NULL,
    "tp_cupom" TEXT NOT NULL,
    "fl_ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cupom_pkey" PRIMARY KEY ("cd_cupom")
);

-- CreateTable
CREATE TABLE "Cupom_Pedido" (
    "cd_pedido" INTEGER NOT NULL,
    "cd_cupom" INTEGER NOT NULL,

    CONSTRAINT "Cupom_Pedido_pkey" PRIMARY KEY ("cd_pedido","cd_cupom")
);

-- CreateTable
CREATE TABLE "Status_Pedido" (
    "cd_status_pedido" SERIAL NOT NULL,
    "nm_status" TEXT NOT NULL,

    CONSTRAINT "Status_Pedido_pkey" PRIMARY KEY ("cd_status_pedido")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cupom_nm_codigo_key" ON "Cupom"("nm_codigo");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_cd_cpf_fkey" FOREIGN KEY ("cd_cpf") REFERENCES "Cliente"("cd_cpf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_cd_endereco_fkey" FOREIGN KEY ("cd_endereco") REFERENCES "Endereco"("cd_endereco") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_cd_status_pedido_fkey" FOREIGN KEY ("cd_status_pedido") REFERENCES "Status_Pedido"("cd_status_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Pedido" ADD CONSTRAINT "Item_Pedido_cd_pedido_fkey" FOREIGN KEY ("cd_pedido") REFERENCES "Pedido"("cd_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento_Pedido" ADD CONSTRAINT "Pagamento_Pedido_cd_pedido_fkey" FOREIGN KEY ("cd_pedido") REFERENCES "Pedido"("cd_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento_Pedido" ADD CONSTRAINT "Pagamento_Pedido_cd_cartao_fkey" FOREIGN KEY ("cd_cartao") REFERENCES "Cartao_credito"("cd_cartao") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cupom_Pedido" ADD CONSTRAINT "Cupom_Pedido_cd_pedido_fkey" FOREIGN KEY ("cd_pedido") REFERENCES "Pedido"("cd_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cupom_Pedido" ADD CONSTRAINT "Cupom_Pedido_cd_cupom_fkey" FOREIGN KEY ("cd_cupom") REFERENCES "Cupom"("cd_cupom") ON DELETE RESTRICT ON UPDATE CASCADE;
