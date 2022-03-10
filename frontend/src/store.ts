import { configureStore } from "@reduxjs/toolkit";

import backendBaseApi from "./api/backend";

const store = configureStore({
    reducer: {
        [backendBaseApi.reducerPath]: backendBaseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        backendBaseApi.middleware,
    ],
});

export default store;
