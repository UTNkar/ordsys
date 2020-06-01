import Axios from "axios";

export enum UtnMembershipResponseErrorCode {
    SSN_MISSING = 1,
    SSN_EMPTY = 2,
    SSN_BADLY_FORMATTED = 3,
}

export interface UtnMembershipResponse {
    is_member?: boolean
    code?: UtnMembershipResponseErrorCode
    message?: string
}

export const UtnMembership = Axios.create({
    baseURL: 'https://www.utn.se',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
