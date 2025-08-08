import { baseQuery } from "@/lib/http-client";
import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    endpoints: () => ({}),
});
