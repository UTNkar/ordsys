import Axios from "axios";

let baseURL = "";

if (process.env.NODE_ENV === 'production') {
    baseURL = "https://ordsys.utn.se/admin";
}
else {
    baseURL = "http://localhost:3000/admin";
}

export const DjangoBackend = Axios.create({
    baseURL,
    // These are set in Django settings with these two keywords:
    // CSRF_COOKIE_NAME = ... (https://docs.djangoproject.com/en/3.1/ref/settings/#csrf-cookie-name)
    // CSRF_HEADER_NAME = ... (https://docs.djangoproject.com/en/3.1/ref/settings/#csrf-header-name)
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true,
})
