import { useMemo } from "react";

import { useMenuItems } from "./useMenuItems";

export function useActiveMenuItems() {
    const { menuItems, ...rest } = useMenuItems();

    const activeMenuItems = useMemo(() => {
        return menuItems.filter((item) => item.active);
    }, [menuItems])

    return { activeMenuItems, ...rest };
}
