import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Status_cliente
 *
 */
export type Status_clienteModel = runtime.Types.Result.DefaultSelection<Prisma.$Status_clientePayload>;
export type AggregateStatus_cliente = {
    _count: Status_clienteCountAggregateOutputType | null;
    _avg: Status_clienteAvgAggregateOutputType | null;
    _sum: Status_clienteSumAggregateOutputType | null;
    _min: Status_clienteMinAggregateOutputType | null;
    _max: Status_clienteMaxAggregateOutputType | null;
};
export type Status_clienteAvgAggregateOutputType = {
    cd_status: number | null;
};
export type Status_clienteSumAggregateOutputType = {
    cd_status: number | null;
};
export type Status_clienteMinAggregateOutputType = {
    cd_status: number | null;
    nm_status: string | null;
};
export type Status_clienteMaxAggregateOutputType = {
    cd_status: number | null;
    nm_status: string | null;
};
export type Status_clienteCountAggregateOutputType = {
    cd_status: number;
    nm_status: number;
    _all: number;
};
export type Status_clienteAvgAggregateInputType = {
    cd_status?: true;
};
export type Status_clienteSumAggregateInputType = {
    cd_status?: true;
};
export type Status_clienteMinAggregateInputType = {
    cd_status?: true;
    nm_status?: true;
};
export type Status_clienteMaxAggregateInputType = {
    cd_status?: true;
    nm_status?: true;
};
export type Status_clienteCountAggregateInputType = {
    cd_status?: true;
    nm_status?: true;
    _all?: true;
};
export type Status_clienteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Status_cliente to aggregate.
     */
    where?: Prisma.Status_clienteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Status_clientes to fetch.
     */
    orderBy?: Prisma.Status_clienteOrderByWithRelationInput | Prisma.Status_clienteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.Status_clienteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Status_clientes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Status_clientes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Status_clientes
    **/
    _count?: true | Status_clienteCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Status_clienteAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Status_clienteSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Status_clienteMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Status_clienteMaxAggregateInputType;
};
export type GetStatus_clienteAggregateType<T extends Status_clienteAggregateArgs> = {
    [P in keyof T & keyof AggregateStatus_cliente]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStatus_cliente[P]> : Prisma.GetScalarType<T[P], AggregateStatus_cliente[P]>;
};
export type Status_clienteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.Status_clienteWhereInput;
    orderBy?: Prisma.Status_clienteOrderByWithAggregationInput | Prisma.Status_clienteOrderByWithAggregationInput[];
    by: Prisma.Status_clienteScalarFieldEnum[] | Prisma.Status_clienteScalarFieldEnum;
    having?: Prisma.Status_clienteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Status_clienteCountAggregateInputType | true;
    _avg?: Status_clienteAvgAggregateInputType;
    _sum?: Status_clienteSumAggregateInputType;
    _min?: Status_clienteMinAggregateInputType;
    _max?: Status_clienteMaxAggregateInputType;
};
export type Status_clienteGroupByOutputType = {
    cd_status: number;
    nm_status: string;
    _count: Status_clienteCountAggregateOutputType | null;
    _avg: Status_clienteAvgAggregateOutputType | null;
    _sum: Status_clienteSumAggregateOutputType | null;
    _min: Status_clienteMinAggregateOutputType | null;
    _max: Status_clienteMaxAggregateOutputType | null;
};
type GetStatus_clienteGroupByPayload<T extends Status_clienteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Status_clienteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Status_clienteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Status_clienteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Status_clienteGroupByOutputType[P]>;
}>>;
export type Status_clienteWhereInput = {
    AND?: Prisma.Status_clienteWhereInput | Prisma.Status_clienteWhereInput[];
    OR?: Prisma.Status_clienteWhereInput[];
    NOT?: Prisma.Status_clienteWhereInput | Prisma.Status_clienteWhereInput[];
    cd_status?: Prisma.IntFilter<"Status_cliente"> | number;
    nm_status?: Prisma.StringFilter<"Status_cliente"> | string;
    clientes?: Prisma.ClienteListRelationFilter;
};
export type Status_clienteOrderByWithRelationInput = {
    cd_status?: Prisma.SortOrder;
    nm_status?: Prisma.SortOrder;
    clientes?: Prisma.ClienteOrderByRelationAggregateInput;
};
export type Status_clienteWhereUniqueInput = Prisma.AtLeast<{
    cd_status?: number;
    AND?: Prisma.Status_clienteWhereInput | Prisma.Status_clienteWhereInput[];
    OR?: Prisma.Status_clienteWhereInput[];
    NOT?: Prisma.Status_clienteWhereInput | Prisma.Status_clienteWhereInput[];
    nm_status?: Prisma.StringFilter<"Status_cliente"> | string;
    clientes?: Prisma.ClienteListRelationFilter;
}, "cd_status">;
export type Status_clienteOrderByWithAggregationInput = {
    cd_status?: Prisma.SortOrder;
    nm_status?: Prisma.SortOrder;
    _count?: Prisma.Status_clienteCountOrderByAggregateInput;
    _avg?: Prisma.Status_clienteAvgOrderByAggregateInput;
    _max?: Prisma.Status_clienteMaxOrderByAggregateInput;
    _min?: Prisma.Status_clienteMinOrderByAggregateInput;
    _sum?: Prisma.Status_clienteSumOrderByAggregateInput;
};
export type Status_clienteScalarWhereWithAggregatesInput = {
    AND?: Prisma.Status_clienteScalarWhereWithAggregatesInput | Prisma.Status_clienteScalarWhereWithAggregatesInput[];
    OR?: Prisma.Status_clienteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.Status_clienteScalarWhereWithAggregatesInput | Prisma.Status_clienteScalarWhereWithAggregatesInput[];
    cd_status?: Prisma.IntWithAggregatesFilter<"Status_cliente"> | number;
    nm_status?: Prisma.StringWithAggregatesFilter<"Status_cliente"> | string;
};
export type Status_clienteCreateInput = {
    nm_status: string;
    clientes?: Prisma.ClienteCreateNestedManyWithoutStatus_clienteInput;
};
export type Status_clienteUncheckedCreateInput = {
    cd_status?: number;
    nm_status: string;
    clientes?: Prisma.ClienteUncheckedCreateNestedManyWithoutStatus_clienteInput;
};
export type Status_clienteUpdateInput = {
    nm_status?: Prisma.StringFieldUpdateOperationsInput | string;
    clientes?: Prisma.ClienteUpdateManyWithoutStatus_clienteNestedInput;
};
export type Status_clienteUncheckedUpdateInput = {
    cd_status?: Prisma.IntFieldUpdateOperationsInput | number;
    nm_status?: Prisma.StringFieldUpdateOperationsInput | string;
    clientes?: Prisma.ClienteUncheckedUpdateManyWithoutStatus_clienteNestedInput;
};
export type Status_clienteCreateManyInput = {
    cd_status?: number;
    nm_status: string;
};
export type Status_clienteUpdateManyMutationInput = {
    nm_status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type Status_clienteUncheckedUpdateManyInput = {
    cd_status?: Prisma.IntFieldUpdateOperationsInput | number;
    nm_status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type Status_clienteScalarRelationFilter = {
    is?: Prisma.Status_clienteWhereInput;
    isNot?: Prisma.Status_clienteWhereInput;
};
export type Status_clienteCountOrderByAggregateInput = {
    cd_status?: Prisma.SortOrder;
    nm_status?: Prisma.SortOrder;
};
export type Status_clienteAvgOrderByAggregateInput = {
    cd_status?: Prisma.SortOrder;
};
export type Status_clienteMaxOrderByAggregateInput = {
    cd_status?: Prisma.SortOrder;
    nm_status?: Prisma.SortOrder;
};
export type Status_clienteMinOrderByAggregateInput = {
    cd_status?: Prisma.SortOrder;
    nm_status?: Prisma.SortOrder;
};
export type Status_clienteSumOrderByAggregateInput = {
    cd_status?: Prisma.SortOrder;
};
export type Status_clienteCreateNestedOneWithoutClientesInput = {
    create?: Prisma.XOR<Prisma.Status_clienteCreateWithoutClientesInput, Prisma.Status_clienteUncheckedCreateWithoutClientesInput>;
    connectOrCreate?: Prisma.Status_clienteCreateOrConnectWithoutClientesInput;
    connect?: Prisma.Status_clienteWhereUniqueInput;
};
export type Status_clienteUpdateOneRequiredWithoutClientesNestedInput = {
    create?: Prisma.XOR<Prisma.Status_clienteCreateWithoutClientesInput, Prisma.Status_clienteUncheckedCreateWithoutClientesInput>;
    connectOrCreate?: Prisma.Status_clienteCreateOrConnectWithoutClientesInput;
    upsert?: Prisma.Status_clienteUpsertWithoutClientesInput;
    connect?: Prisma.Status_clienteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.Status_clienteUpdateToOneWithWhereWithoutClientesInput, Prisma.Status_clienteUpdateWithoutClientesInput>, Prisma.Status_clienteUncheckedUpdateWithoutClientesInput>;
};
export type Status_clienteCreateWithoutClientesInput = {
    nm_status: string;
};
export type Status_clienteUncheckedCreateWithoutClientesInput = {
    cd_status?: number;
    nm_status: string;
};
export type Status_clienteCreateOrConnectWithoutClientesInput = {
    where: Prisma.Status_clienteWhereUniqueInput;
    create: Prisma.XOR<Prisma.Status_clienteCreateWithoutClientesInput, Prisma.Status_clienteUncheckedCreateWithoutClientesInput>;
};
export type Status_clienteUpsertWithoutClientesInput = {
    update: Prisma.XOR<Prisma.Status_clienteUpdateWithoutClientesInput, Prisma.Status_clienteUncheckedUpdateWithoutClientesInput>;
    create: Prisma.XOR<Prisma.Status_clienteCreateWithoutClientesInput, Prisma.Status_clienteUncheckedCreateWithoutClientesInput>;
    where?: Prisma.Status_clienteWhereInput;
};
export type Status_clienteUpdateToOneWithWhereWithoutClientesInput = {
    where?: Prisma.Status_clienteWhereInput;
    data: Prisma.XOR<Prisma.Status_clienteUpdateWithoutClientesInput, Prisma.Status_clienteUncheckedUpdateWithoutClientesInput>;
};
export type Status_clienteUpdateWithoutClientesInput = {
    nm_status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type Status_clienteUncheckedUpdateWithoutClientesInput = {
    cd_status?: Prisma.IntFieldUpdateOperationsInput | number;
    nm_status?: Prisma.StringFieldUpdateOperationsInput | string;
};
/**
 * Count Type Status_clienteCountOutputType
 */
export type Status_clienteCountOutputType = {
    clientes: number;
};
export type Status_clienteCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clientes?: boolean | Status_clienteCountOutputTypeCountClientesArgs;
};
/**
 * Status_clienteCountOutputType without action
 */
export type Status_clienteCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_clienteCountOutputType
     */
    select?: Prisma.Status_clienteCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * Status_clienteCountOutputType without action
 */
export type Status_clienteCountOutputTypeCountClientesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClienteWhereInput;
};
export type Status_clienteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    cd_status?: boolean;
    nm_status?: boolean;
    clientes?: boolean | Prisma.Status_cliente$clientesArgs<ExtArgs>;
    _count?: boolean | Prisma.Status_clienteCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["status_cliente"]>;
export type Status_clienteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    cd_status?: boolean;
    nm_status?: boolean;
}, ExtArgs["result"]["status_cliente"]>;
export type Status_clienteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    cd_status?: boolean;
    nm_status?: boolean;
}, ExtArgs["result"]["status_cliente"]>;
export type Status_clienteSelectScalar = {
    cd_status?: boolean;
    nm_status?: boolean;
};
export type Status_clienteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"cd_status" | "nm_status", ExtArgs["result"]["status_cliente"]>;
export type Status_clienteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clientes?: boolean | Prisma.Status_cliente$clientesArgs<ExtArgs>;
    _count?: boolean | Prisma.Status_clienteCountOutputTypeDefaultArgs<ExtArgs>;
};
export type Status_clienteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type Status_clienteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $Status_clientePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Status_cliente";
    objects: {
        clientes: Prisma.$ClientePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        cd_status: number;
        nm_status: string;
    }, ExtArgs["result"]["status_cliente"]>;
    composites: {};
};
export type Status_clienteGetPayload<S extends boolean | null | undefined | Status_clienteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$Status_clientePayload, S>;
export type Status_clienteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<Status_clienteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Status_clienteCountAggregateInputType | true;
};
export interface Status_clienteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Status_cliente'];
        meta: {
            name: 'Status_cliente';
        };
    };
    /**
     * Find zero or one Status_cliente that matches the filter.
     * @param {Status_clienteFindUniqueArgs} args - Arguments to find a Status_cliente
     * @example
     * // Get one Status_cliente
     * const status_cliente = await prisma.status_cliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Status_clienteFindUniqueArgs>(args: Prisma.SelectSubset<T, Status_clienteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__Status_clienteClient<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Status_cliente that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {Status_clienteFindUniqueOrThrowArgs} args - Arguments to find a Status_cliente
     * @example
     * // Get one Status_cliente
     * const status_cliente = await prisma.status_cliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Status_clienteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, Status_clienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__Status_clienteClient<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Status_cliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Status_clienteFindFirstArgs} args - Arguments to find a Status_cliente
     * @example
     * // Get one Status_cliente
     * const status_cliente = await prisma.status_cliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Status_clienteFindFirstArgs>(args?: Prisma.SelectSubset<T, Status_clienteFindFirstArgs<ExtArgs>>): Prisma.Prisma__Status_clienteClient<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Status_cliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Status_clienteFindFirstOrThrowArgs} args - Arguments to find a Status_cliente
     * @example
     * // Get one Status_cliente
     * const status_cliente = await prisma.status_cliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Status_clienteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, Status_clienteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__Status_clienteClient<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Status_clientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Status_clienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Status_clientes
     * const status_clientes = await prisma.status_cliente.findMany()
     *
     * // Get first 10 Status_clientes
     * const status_clientes = await prisma.status_cliente.findMany({ take: 10 })
     *
     * // Only select the `cd_status`
     * const status_clienteWithCd_statusOnly = await prisma.status_cliente.findMany({ select: { cd_status: true } })
     *
     */
    findMany<T extends Status_clienteFindManyArgs>(args?: Prisma.SelectSubset<T, Status_clienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Status_cliente.
     * @param {Status_clienteCreateArgs} args - Arguments to create a Status_cliente.
     * @example
     * // Create one Status_cliente
     * const Status_cliente = await prisma.status_cliente.create({
     *   data: {
     *     // ... data to create a Status_cliente
     *   }
     * })
     *
     */
    create<T extends Status_clienteCreateArgs>(args: Prisma.SelectSubset<T, Status_clienteCreateArgs<ExtArgs>>): Prisma.Prisma__Status_clienteClient<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Status_clientes.
     * @param {Status_clienteCreateManyArgs} args - Arguments to create many Status_clientes.
     * @example
     * // Create many Status_clientes
     * const status_cliente = await prisma.status_cliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends Status_clienteCreateManyArgs>(args?: Prisma.SelectSubset<T, Status_clienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Status_clientes and returns the data saved in the database.
     * @param {Status_clienteCreateManyAndReturnArgs} args - Arguments to create many Status_clientes.
     * @example
     * // Create many Status_clientes
     * const status_cliente = await prisma.status_cliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Status_clientes and only return the `cd_status`
     * const status_clienteWithCd_statusOnly = await prisma.status_cliente.createManyAndReturn({
     *   select: { cd_status: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends Status_clienteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, Status_clienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Status_cliente.
     * @param {Status_clienteDeleteArgs} args - Arguments to delete one Status_cliente.
     * @example
     * // Delete one Status_cliente
     * const Status_cliente = await prisma.status_cliente.delete({
     *   where: {
     *     // ... filter to delete one Status_cliente
     *   }
     * })
     *
     */
    delete<T extends Status_clienteDeleteArgs>(args: Prisma.SelectSubset<T, Status_clienteDeleteArgs<ExtArgs>>): Prisma.Prisma__Status_clienteClient<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Status_cliente.
     * @param {Status_clienteUpdateArgs} args - Arguments to update one Status_cliente.
     * @example
     * // Update one Status_cliente
     * const status_cliente = await prisma.status_cliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends Status_clienteUpdateArgs>(args: Prisma.SelectSubset<T, Status_clienteUpdateArgs<ExtArgs>>): Prisma.Prisma__Status_clienteClient<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Status_clientes.
     * @param {Status_clienteDeleteManyArgs} args - Arguments to filter Status_clientes to delete.
     * @example
     * // Delete a few Status_clientes
     * const { count } = await prisma.status_cliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends Status_clienteDeleteManyArgs>(args?: Prisma.SelectSubset<T, Status_clienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Status_clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Status_clienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Status_clientes
     * const status_cliente = await prisma.status_cliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends Status_clienteUpdateManyArgs>(args: Prisma.SelectSubset<T, Status_clienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Status_clientes and returns the data updated in the database.
     * @param {Status_clienteUpdateManyAndReturnArgs} args - Arguments to update many Status_clientes.
     * @example
     * // Update many Status_clientes
     * const status_cliente = await prisma.status_cliente.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Status_clientes and only return the `cd_status`
     * const status_clienteWithCd_statusOnly = await prisma.status_cliente.updateManyAndReturn({
     *   select: { cd_status: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends Status_clienteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, Status_clienteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Status_cliente.
     * @param {Status_clienteUpsertArgs} args - Arguments to update or create a Status_cliente.
     * @example
     * // Update or create a Status_cliente
     * const status_cliente = await prisma.status_cliente.upsert({
     *   create: {
     *     // ... data to create a Status_cliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Status_cliente we want to update
     *   }
     * })
     */
    upsert<T extends Status_clienteUpsertArgs>(args: Prisma.SelectSubset<T, Status_clienteUpsertArgs<ExtArgs>>): Prisma.Prisma__Status_clienteClient<runtime.Types.Result.GetResult<Prisma.$Status_clientePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Status_clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Status_clienteCountArgs} args - Arguments to filter Status_clientes to count.
     * @example
     * // Count the number of Status_clientes
     * const count = await prisma.status_cliente.count({
     *   where: {
     *     // ... the filter for the Status_clientes we want to count
     *   }
     * })
    **/
    count<T extends Status_clienteCountArgs>(args?: Prisma.Subset<T, Status_clienteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Status_clienteCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Status_cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Status_clienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Status_clienteAggregateArgs>(args: Prisma.Subset<T, Status_clienteAggregateArgs>): Prisma.PrismaPromise<GetStatus_clienteAggregateType<T>>;
    /**
     * Group by Status_cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Status_clienteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends Status_clienteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: Status_clienteGroupByArgs['orderBy'];
    } : {
        orderBy?: Status_clienteGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, Status_clienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStatus_clienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Status_cliente model
     */
    readonly fields: Status_clienteFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Status_cliente.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__Status_clienteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    clientes<T extends Prisma.Status_cliente$clientesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Status_cliente$clientesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Status_cliente model
 */
export interface Status_clienteFieldRefs {
    readonly cd_status: Prisma.FieldRef<"Status_cliente", 'Int'>;
    readonly nm_status: Prisma.FieldRef<"Status_cliente", 'String'>;
}
/**
 * Status_cliente findUnique
 */
export type Status_clienteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * Filter, which Status_cliente to fetch.
     */
    where: Prisma.Status_clienteWhereUniqueInput;
};
/**
 * Status_cliente findUniqueOrThrow
 */
export type Status_clienteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * Filter, which Status_cliente to fetch.
     */
    where: Prisma.Status_clienteWhereUniqueInput;
};
/**
 * Status_cliente findFirst
 */
export type Status_clienteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * Filter, which Status_cliente to fetch.
     */
    where?: Prisma.Status_clienteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Status_clientes to fetch.
     */
    orderBy?: Prisma.Status_clienteOrderByWithRelationInput | Prisma.Status_clienteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Status_clientes.
     */
    cursor?: Prisma.Status_clienteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Status_clientes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Status_clientes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Status_clientes.
     */
    distinct?: Prisma.Status_clienteScalarFieldEnum | Prisma.Status_clienteScalarFieldEnum[];
};
/**
 * Status_cliente findFirstOrThrow
 */
export type Status_clienteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * Filter, which Status_cliente to fetch.
     */
    where?: Prisma.Status_clienteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Status_clientes to fetch.
     */
    orderBy?: Prisma.Status_clienteOrderByWithRelationInput | Prisma.Status_clienteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Status_clientes.
     */
    cursor?: Prisma.Status_clienteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Status_clientes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Status_clientes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Status_clientes.
     */
    distinct?: Prisma.Status_clienteScalarFieldEnum | Prisma.Status_clienteScalarFieldEnum[];
};
/**
 * Status_cliente findMany
 */
export type Status_clienteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * Filter, which Status_clientes to fetch.
     */
    where?: Prisma.Status_clienteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Status_clientes to fetch.
     */
    orderBy?: Prisma.Status_clienteOrderByWithRelationInput | Prisma.Status_clienteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Status_clientes.
     */
    cursor?: Prisma.Status_clienteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Status_clientes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Status_clientes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Status_clientes.
     */
    distinct?: Prisma.Status_clienteScalarFieldEnum | Prisma.Status_clienteScalarFieldEnum[];
};
/**
 * Status_cliente create
 */
export type Status_clienteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * The data needed to create a Status_cliente.
     */
    data: Prisma.XOR<Prisma.Status_clienteCreateInput, Prisma.Status_clienteUncheckedCreateInput>;
};
/**
 * Status_cliente createMany
 */
export type Status_clienteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Status_clientes.
     */
    data: Prisma.Status_clienteCreateManyInput | Prisma.Status_clienteCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Status_cliente createManyAndReturn
 */
export type Status_clienteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * The data used to create many Status_clientes.
     */
    data: Prisma.Status_clienteCreateManyInput | Prisma.Status_clienteCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Status_cliente update
 */
export type Status_clienteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * The data needed to update a Status_cliente.
     */
    data: Prisma.XOR<Prisma.Status_clienteUpdateInput, Prisma.Status_clienteUncheckedUpdateInput>;
    /**
     * Choose, which Status_cliente to update.
     */
    where: Prisma.Status_clienteWhereUniqueInput;
};
/**
 * Status_cliente updateMany
 */
export type Status_clienteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Status_clientes.
     */
    data: Prisma.XOR<Prisma.Status_clienteUpdateManyMutationInput, Prisma.Status_clienteUncheckedUpdateManyInput>;
    /**
     * Filter which Status_clientes to update
     */
    where?: Prisma.Status_clienteWhereInput;
    /**
     * Limit how many Status_clientes to update.
     */
    limit?: number;
};
/**
 * Status_cliente updateManyAndReturn
 */
export type Status_clienteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * The data used to update Status_clientes.
     */
    data: Prisma.XOR<Prisma.Status_clienteUpdateManyMutationInput, Prisma.Status_clienteUncheckedUpdateManyInput>;
    /**
     * Filter which Status_clientes to update
     */
    where?: Prisma.Status_clienteWhereInput;
    /**
     * Limit how many Status_clientes to update.
     */
    limit?: number;
};
/**
 * Status_cliente upsert
 */
export type Status_clienteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * The filter to search for the Status_cliente to update in case it exists.
     */
    where: Prisma.Status_clienteWhereUniqueInput;
    /**
     * In case the Status_cliente found by the `where` argument doesn't exist, create a new Status_cliente with this data.
     */
    create: Prisma.XOR<Prisma.Status_clienteCreateInput, Prisma.Status_clienteUncheckedCreateInput>;
    /**
     * In case the Status_cliente was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.Status_clienteUpdateInput, Prisma.Status_clienteUncheckedUpdateInput>;
};
/**
 * Status_cliente delete
 */
export type Status_clienteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
    /**
     * Filter which Status_cliente to delete.
     */
    where: Prisma.Status_clienteWhereUniqueInput;
};
/**
 * Status_cliente deleteMany
 */
export type Status_clienteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Status_clientes to delete
     */
    where?: Prisma.Status_clienteWhereInput;
    /**
     * Limit how many Status_clientes to delete.
     */
    limit?: number;
};
/**
 * Status_cliente.clientes
 */
export type Status_cliente$clientesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: Prisma.ClienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cliente
     */
    omit?: Prisma.ClienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClienteInclude<ExtArgs> | null;
    where?: Prisma.ClienteWhereInput;
    orderBy?: Prisma.ClienteOrderByWithRelationInput | Prisma.ClienteOrderByWithRelationInput[];
    cursor?: Prisma.ClienteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClienteScalarFieldEnum | Prisma.ClienteScalarFieldEnum[];
};
/**
 * Status_cliente without action
 */
export type Status_clienteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Status_cliente
     */
    select?: Prisma.Status_clienteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Status_cliente
     */
    omit?: Prisma.Status_clienteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.Status_clienteInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Status_cliente.d.ts.map