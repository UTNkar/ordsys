import Axios from "axios";

let baseURL = "";

if (process.env.NODE_ENV === 'production') {
    baseURL = "https://ordsysbackend.utn.se";
}
else {
    baseURL = "http://localhost:8000";
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
