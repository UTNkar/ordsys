import { DjangoBackend } from '../api/DjangoBackend';
import { applyTheme } from './theme'
import { Organisation } from '../@types';

const tokenName = 'token'

export function isAuthenticated(): boolean {
    const headerToken = DjangoBackend.defaults.headers.common.Authorization
    if (headerToken === undefined) {
        const sessionToken = sessionStorage.getItem(tokenName)
        if (sessionToken === null) {
            return false
        }
        DjangoBackend.defaults.headers.common.Authorization = sessionToken
    }
    return true
}

export function getToken(): string | undefined {
    // Return the token without the "Token " preamble
    return DjangoBackend.defaults.headers.common.Authorization.slice(6)
}

export async function logIn(organisation: Organisation, username: string, password: string): Promise<void> {
    const response = await DjangoBackend.post('/rest-auth/login/', { username, password })
    const token = response.data.key
    DjangoBackend.defaults.headers.common.Authorization = `Token ${token}`
    sessionStorage.setItem(tokenName, `Token ${token}`)
    applyTheme(organisation.theme)
}
