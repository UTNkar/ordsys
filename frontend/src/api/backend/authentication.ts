import { Organisation, OrganisationTheme, User } from "../../@types";
import backendBaseApi, { TAG_TYPES } from "./backend";

const authenticationApi = backendBaseApi.injectEndpoints({
    endpoints: (build) => ({
        getSignInStatus: build.query<User & { theme: OrganisationTheme } | null, undefined>({
            query: () => '/auth/status/',
            providesTags: [TAG_TYPES.AUTHENTICATION_STATUS],
        }),
        getOrganisations: build.query<Organisation[], undefined>({
            query: () => '/api/organisations_with_users/',
        }),
        signIn: build.mutation<null, { username: string, password: string }>({
            query: ({ username, password }) => ({
                url: '/auth/login/',
                method: "POST",
                body: { username, password },
            }),
            invalidatesTags: (_result, error) => (
                !error ? [TAG_TYPES.AUTHENTICATION_STATUS] : []
            ),
            extraOptions: { maxRetries: 0 },
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetSignInStatusQuery,
    useGetOrganisationsQuery,
    useSignInMutation,
} = authenticationApi;
