import { useGetMenuItemsQuery } from '../api/backend';

export function useMenuItems() {
  const {
    data: menuItems = [],
    ...rest
  } = useGetMenuItemsQuery(undefined);

  return { menuItems, ...rest };
}
