import type { PatchCollection, Recipe } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import type { PromiseWithKnownReason } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";
import type { Order, OrderItem } from "../../@types";
import { DatabaseChangeType, OrderStatus } from "../../@types";

import backendBaseApi from "./backend";
import { createWebsocket } from "./utils";

type OrderItemPostData = {
    menu: number,
    quantity: number,
    special_requests?: string
};
type OrderPostData = {
    customer_number: string,
    note: string,
    beverages_only: boolean,
    order_items: OrderItemPostData[]
};
type OrderWithoutItems = Exclude<Order, OrderItem[]>;

const ordersApi = backendBaseApi.injectEndpoints({
    endpoints: (build) => ({
        getOrders: build.query<OrderWithoutItems[], string>({
            query: (queryParams) => `/api/orders/${queryParams}`,
            onCacheEntryAdded: listenForOrderUpdates,
        }),
        getOrdersWithItems: build.query<Order[], string>({
            query: (queryParams) => `/api/orders_with_order_items/${queryParams}`,
            onCacheEntryAdded: listenForOrderUpdates,
        }),
        createOrder: build.mutation<Order[], OrderPostData[]>({
            query: (body) => ({
                url: '/api/manage_orders_with_order_items/',
                method: "POST",
                body,
            }),
        }),
        deleteOrder: build.mutation<undefined, number>({
            query: (orderId) => ({
                url: `/api/orders/${orderId}/`,
                method: "DELETE",
            }),
        }),
        updateOrder: build.mutation<Order, { orderId: number, body: object }>({
            query: ({ orderId, body }) => ({
                url: `/api/orders/${orderId}/`,
                method: "PATCH",
                body,
            })
        }),
        updateOrderContents: build.mutation<Order, { orderId: number, body: object }>({
           query: ({ orderId, body }) => ({
               url: `/api/manage_orders_with_order_items/${orderId}/`,
               method: "PATCH",
               body,
           })
        }),
    }),
    overrideExisting: true,
});

function listenForOrderUpdates(
    _arg: string,
    { cacheDataLoaded, cacheEntryRemoved, updateCachedData }: {
        cacheDataLoaded: PromiseWithKnownReason<
            { data: Order[], meta: {} | undefined },
            Error & { message: "Promise never resolved before cacheEntryRemoved." }>,
        cacheEntryRemoved: Promise<void>,
        updateCachedData: (updateRecipe: Recipe<Order[]>) => PatchCollection,
    },
) {
    const websocket = createWebsocket();
    websocket.addEventListener('open', () => {
        websocket.send(JSON.stringify({ models: ['backend.Order'] }));
    }, { once: true, passive: true });
    cacheDataLoaded.then(() => {
        websocket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if (message.model_name === 'Order') {
                const order = message.payload as Order;
                const changeType = message.type as DatabaseChangeType;
                updateCachedData((draft) => {
                    if (changeType === DatabaseChangeType.CREATE) {
                        draft.push(order);
                    } else {
                        const index = draft.findIndex((o) => o.id === order.id);
                        if (index === -1) {
                            return;
                        }
                        if (changeType === DatabaseChangeType.UPDATE) {
                            if (order.status !== OrderStatus.DELIVERED) {
                                draft[index] = order;
                            } else {
                                draft.splice(index, 1);
                            }
                        } else {
                            draft.splice(index, 1);
                        }
                    }
                });
            }
        }, { passive: true });
    }).catch(() => {/* no-op */});
    cacheEntryRemoved.then(() => websocket.close());
}

export const {
    useGetOrdersQuery,
    useGetOrdersWithItemsQuery,
    useLazyGetOrdersWithItemsQuery,
    useCreateOrderMutation,
    useDeleteOrderMutation,
    useUpdateOrderMutation,
    useUpdateOrderContentsMutation,
} = ordersApi;
