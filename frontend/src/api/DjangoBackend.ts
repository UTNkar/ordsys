import Axios from "axios";

export const DjangoBackend = Axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        common: {
            Authorization: undefined
        },
        'Content-Type': 'application/json'
    }
})
