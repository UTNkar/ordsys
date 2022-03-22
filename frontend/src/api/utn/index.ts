import utnApi from "./utn";

export interface UtnMembershipResponse {
    is_member?: boolean
    error?: string
}

export * from "./utn";
export default utnApi;
