import type { MenuItem } from "../@types";

import { useCallback } from "react";
import { useMenuItems } from "./useMenuItems";
import { useLazyGetOrdersWithItemsQuery } from "../api/backend";

export function useOrderHistory() {
    const { menuItems } = useMenuItems();
    const [
        getOrderHistoryInternal,
        { data: orderHistory, isFetching },
    ] = useLazyGetOrdersWithItemsQuery({
        selectFromResult: ({ data = [], isFetching }) => {
            const chartOptions: { data?: object[], animationEnabled?: boolean, exportEnabled?: boolean } = {};
            if (data.length > 0) {
                const dataPoints: { label: string, y: number }[] = []
                data.forEach(order => {
                    order.order_items.forEach(orderItem => {
                        const menuItem = menuItems.find(item => item.id === orderItem.menu) as MenuItem
                        const dataPointIndex = dataPoints.findIndex(item => item.label === menuItem.item_name)
                        if (dataPointIndex === -1) {
                            dataPoints.push({ label: menuItem.item_name, y: orderItem.quantity})
                        } else {
                            dataPoints[dataPointIndex].y += orderItem.quantity
                        }
                    })
                })
                chartOptions.animationEnabled = true;
                chartOptions.exportEnabled = true;
                chartOptions.data = [{
                    type: 'bar',
                    toolTipContent: "<b>{label}</b>: {y} st",
                    showInLegend: true,
                    legendText: '{label}',
                    indexLabelFontSize: 16,
                    indexLabel: '{label} - {y} st',
                    dataPoints,
                }]
            }

            return {
                isFetching,
                data: chartOptions,
            }
        },
    });

    const getOrderHistory = useCallback((startDate: Date, endDate: Date) => {
        return getOrderHistoryInternal(
            `?younger_than=${endDate.toISOString()}&older_than=${startDate.toISOString()}`,
            true,
        );
    }, [getOrderHistoryInternal]);

    return { getOrderHistory, orderHistory, isFetching };
}
