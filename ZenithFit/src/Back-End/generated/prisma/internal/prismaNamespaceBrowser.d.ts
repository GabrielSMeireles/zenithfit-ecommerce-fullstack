import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: any;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: any;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: any;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: any;
export declare const ModelName: {
    readonly Cliente: "Cliente";
    readonly Genero: "Genero";
    readonly Tipo_telefone: "Tipo_telefone";
    readonly Status_cliente: "Status_cliente";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: any;
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const ClienteScalarFieldEnum: {
    readonly cd_cpf: "cd_cpf";
    readonly nm_nome_cliente: "nm_nome_cliente";
    readonly dt_nascimento: "dt_nascimento";
    readonly cd_telefone: "cd_telefone";
    readonly cd_DDD: "cd_DDD";
    readonly nm_identificacao_telefone: "nm_identificacao_telefone";
    readonly nm_email: "nm_email";
    readonly cd_senha: "cd_senha";
    readonly cd_rank_cliente: "cd_rank_cliente";
    readonly cd_genero: "cd_genero";
    readonly cd_tipo_telefone: "cd_tipo_telefone";
    readonly cd_status: "cd_status";
};
export type ClienteScalarFieldEnum = (typeof ClienteScalarFieldEnum)[keyof typeof ClienteScalarFieldEnum];
export declare const GeneroScalarFieldEnum: {
    readonly cd_genero: "cd_genero";
    readonly nm_genero: "nm_genero";
};
export type GeneroScalarFieldEnum = (typeof GeneroScalarFieldEnum)[keyof typeof GeneroScalarFieldEnum];
export declare const Tipo_telefoneScalarFieldEnum: {
    readonly cd_tipo_telefone: "cd_tipo_telefone";
    readonly nm_tipo_telefone: "nm_tipo_telefone";
};
export type Tipo_telefoneScalarFieldEnum = (typeof Tipo_telefoneScalarFieldEnum)[keyof typeof Tipo_telefoneScalarFieldEnum];
export declare const Status_clienteScalarFieldEnum: {
    readonly cd_status: "cd_status";
    readonly nm_status: "nm_status";
};
export type Status_clienteScalarFieldEnum = (typeof Status_clienteScalarFieldEnum)[keyof typeof Status_clienteScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map