import { useMemo } from "react";

import { useGetOrdersWithItemsQuery } from "../api/backend";
import { orderAscSorter, orderDescSorter } from "../utils/sorters";

export function useOrdersWithItems(queryParams: string, isAscSort = true) {
    const {
        data = [],
        ...rest
    } = useGetOrdersWithItemsQuery(queryParams);

    const orders = useMemo(() => {
        return data.slice(0).sort(isAscSort ? orderAscSorter : orderDescSorter);
    }, [data, isAscSort]);

    return { orders, ...rest };
}
