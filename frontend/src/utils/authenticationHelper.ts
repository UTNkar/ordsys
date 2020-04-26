import { DjangoBackend } from '../api/DjangoBackend';

const tokenName = 'token'

export async function logIn(username: string, password: string): Promise<void> {
    const response = await DjangoBackend.post('/rest-auth/login/', { username, password })
    const token = response.data.key
    DjangoBackend.defaults.headers.common.Authorization = `Token ${token}`
    sessionStorage.setItem(tokenName, `Token ${token}`)
}
