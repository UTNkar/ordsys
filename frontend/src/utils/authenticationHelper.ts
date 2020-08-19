import { DjangoBackend } from '../api/DjangoBackend';
import { applyTheme } from './theme'
import { Organisation } from '../@types';

const authenticationStatus = 'isAuthenticated'

export function isAuthenticated(): boolean {
    return sessionStorage.getItem(authenticationStatus) === 'true'
}

export async function logIn(organisation: Organisation, username: string, password: string): Promise<void> {
    await DjangoBackend.post('/auth/login/', { username, password })
    sessionStorage.setItem(authenticationStatus, 'true')
    applyTheme(organisation.theme)
}
