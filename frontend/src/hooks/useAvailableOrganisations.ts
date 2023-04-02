import { useGetOrganisationsQuery } from '../api/backend';

export function useAvailableOrganisations() {
  const {
    data: organisations = [],
    ...rest
  } = useGetOrganisationsQuery(undefined, {
    selectFromResult: ({ data, isError, isLoading }) => ({ data, isError, isLoading }),
  });

  return { organisations, ...rest };
}
