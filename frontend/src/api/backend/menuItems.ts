import { DatabaseChangeType, MenuItem } from '../../@types';
import { menuItemSorter } from '../../utils/sorters';

import backendBaseApi from './backend';
import { createWebsocket } from './utils';

const menuItemsApi = backendBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getMenuItems: build.query<MenuItem[], undefined>({
      query: () => '/api/menu_items/',
      onCacheEntryAdded: (
        _arg,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) => {
        const websocket = createWebsocket();
        websocket.addEventListener('open', () => {
          websocket.send(JSON.stringify({ models: ['backend.MenuItem'] }));
        }, { once: true, passive: true });
        cacheDataLoaded.then(() => {
          websocket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if (message.model_name === 'MenuItem') {
              const menuItem = message.payload as MenuItem;
              const changeType = message.type as DatabaseChangeType;
              updateCachedData((draft) => {
                if (changeType === DatabaseChangeType.CREATE) {
                  draft.push(menuItem);
                  draft.sort(menuItemSorter);
                } else {
                  const index = draft.findIndex((item) => item.id === menuItem.id);
                  if (changeType === DatabaseChangeType.UPDATE) {
                    if (index !== -1) {
                      draft[index] = menuItem;
                      draft.sort(menuItemSorter);
                    } else {
                      draft.push(menuItem);
                      draft.sort(menuItemSorter);
                    }
                  } else if (index !== -1) {
                    draft.splice(index, 1);
                  }
                }
              });
            }
          }, { passive: true });
        }).catch(() => { /* no-op */ });
        cacheEntryRemoved.then(() => websocket.close());
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetMenuItemsQuery } = menuItemsApi;
