export interface GoogleSSOResponse {
    clientId: string;
    credential: string;
    select_by: string;
}

export interface GoogleSSOUser {
    // https://developers.google.com/identity/gsi/web/reference/js-reference

    aud: string;
    azp: string;
    email: string;
    email_verified: boolean;
    exp: number;
    given_name: string;
    iat: number;
    iss: string;
    jti: string;
    name: string;
    nbf: number;
    picture: string;

    // id
    sub: string;
}
