import { useMemo } from 'react';

import { useGetOrdersQuery } from '../api/backend';
import { orderAscSorter, orderDescSorter } from '../utils/sorters';

export function useOrders(query: string, isAscSort = true) {
  const { data = [], ...rest } = useGetOrdersQuery(query);

  const orders = useMemo(
    () => data.slice(0).sort(isAscSort ? orderAscSorter : orderDescSorter),
    [data, isAscSort],
  );

  return { orders, ...rest };
}
