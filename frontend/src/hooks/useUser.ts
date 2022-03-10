import { useGetSignInStatusQuery } from "../api/backend";

export function useUser() {
    const {
        data: user,
        ...rest
    } = useGetSignInStatusQuery(undefined, {
        selectFromResult: ({ data, error, isLoading, isUninitialized }) =>
            ({ data, error, isLoading, isUninitialized }),
    });

    return { user, ...rest };
}
