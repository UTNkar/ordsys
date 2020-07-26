import { DjangoBackend } from '../api/DjangoBackend';
import { clearEvent } from './event';
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

export async function logIn(organisation: Organisation, username: string, password: string): Promise<void> {
    const response = await DjangoBackend.post('/rest-auth/login/', { username, password })
    const token = response.data.key
    DjangoBackend.defaults.headers.common.Authorization = `Token ${token}`
    sessionStorage.setItem(tokenName, `Token ${token}`)
    applyTheme(organisation.theme)
}

export function logOut() {
    DjangoBackend.post('/rest-auth/logout/')
        /*
          It does not matter if the request is unsuccessful or not as we delete the token locally anyway.
          If the request succeeds, a new token is generated upon a new, successful call to the "logIn"
          otherwise the same token is retrieved again.

          If several people are logged in to the same account, all sessions are invalidated if the request succeeds.
         */
        .catch(reason => console.log(reason.response))
    DjangoBackend.defaults.headers.common.Authorization = undefined
    sessionStorage.removeItem(tokenName)
    clearEvent()
}
