import "dotenv/config";
import { PrismaClient } from "@prisma/client";
// O PrismaClient busca a URL do banco automaticamente no seu .env
const prisma = new PrismaClient();
export { prisma };
export async function connection() {
    try {
        await prisma.$connect();
        console.log("Conectado com o BD com sucesso!");
    }
    catch (error) {
        console.error("Erro ao conectar com o BD:", error);
    }
}
//# sourceMappingURL=db.js.map