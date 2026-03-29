-- CreateTable
CREATE TABLE "Produto" (
    "cd_produto" SERIAL NOT NULL,
    "nm_produto" TEXT NOT NULL,
    "ds_produto" TEXT,
    "vl_produto" DECIMAL(10,2) NOT NULL,
    "nm_imagem_url" TEXT,
    "qt_estoque" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("cd_produto")
);

-- AddForeignKey
ALTER TABLE "Item_Pedido" ADD CONSTRAINT "Item_Pedido_cd_produto_fkey" FOREIGN KEY ("cd_produto") REFERENCES "Produto"("cd_produto") ON DELETE RESTRICT ON UPDATE CASCADE;
