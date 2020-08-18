import Axios from "axios";

let baseURL = "";

if (process.env.NODE_ENV === 'production') {
    baseURL = "https://ordsys.utn.se/backend";
}
else {
    baseURL = "http://localhost:8000";
}

export const DjangoBackend = Axios.create({
    baseURL,
    headers: {
        common: {
            Authorization: undefined
        },
        'Content-Type': 'application/json'
    }
})
