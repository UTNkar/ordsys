import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

let baseURL;
if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://ordsys.utn.se/admin';
} else {
  baseURL = 'http://localhost:3000/admin';
}

const fetchBaseQueryWithRetries = retry(fetchBaseQuery({
  baseUrl: baseURL,
  credentials: 'include',
  prepareHeaders: (headers, { type }) => {
    headers.set('Accept', 'application/json');
    if (type === 'mutation') {
      headers.set('Content-Type', 'application/json');
    }

    const csrfToken = Cookies.get('csrftoken');
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }

    return headers;
  },
}), { maxRetries: 3 });

export const TAG_TYPES = Object.freeze({
  AUTHENTICATION_STATUS: 'Authentication status',
});

const backendBaseApi = createApi({
  reducerPath: 'backend',
  baseQuery: fetchBaseQueryWithRetries,
  endpoints: () => ({}),
  tagTypes: Object.values(TAG_TYPES),
});

export default backendBaseApi;
