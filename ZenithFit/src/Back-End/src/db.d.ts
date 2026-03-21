import "dotenv/config";
import { PrismaClient } from "@prisma/client";
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { prisma };
export declare function connection(): Promise<void>;
//# sourceMappingURL=db.d.ts.map