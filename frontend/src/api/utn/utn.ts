import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

import type { UtnMembershipResponse } from "./";

const fetchBaseQueryWithRetries = retry(fetchBaseQuery({
    baseUrl: "https://www.utn.se",
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/x-www-form-urlencoded")
        return headers;
    },
}), { maxRetries: 2 });

/**
 * Valid Swedish personal IDs are:
 * - YYMMDDXXXX
 * - YYMMDD-XXXX
 * - YYYYMMDDXXXX
 * - YYYYMMDD-XXXX
 *
 * The regex tests for 6 or 8 digits, followed by an optional -, followed by 4 digits
 */
const personalIdRegex = /^(\d{6}|\d{8})-?\d{4}$/

const utnApi = createApi({
    reducerPath: "backend",
    baseQuery: fetchBaseQueryWithRetries,
    endpoints: (build) => ({
        checkMembership: build.mutation<UtnMembershipResponse, string>({
            // @ts-ignore
            queryFn: (swedishId, _api, _options, baseQuery) => {
                if (!personalIdRegex.test(swedishId)) {
                   return { error: true };
                } else {
                    return baseQuery({
                        url: "/member_check_api/",
                        method: "POST",
                        body: `ssn=${swedishId}`,
                        validateStatus: (request) => request.ok || request.status === 400,
                    })
                       // @ts-ignore
                        .then(({ data, error, meta }) => {
                            if (meta.response.ok) {
                                return { data, meta };
                            } else if (data?.error) {
                                return { error: true };
                            } else {
                                return { error, meta };
                            }
                        })
                }
            },
        }),
    }),
});

export const {
    useCheckMembershipMutation,
} = utnApi;
export default utnApi;
