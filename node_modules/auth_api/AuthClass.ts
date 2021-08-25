export class AppClient {
    url: string
    clientID: string
    clientSecret: string
    //TODO: impliment appAuth: string
    constructor(apiWebsite: string, AppClientID: string, AppClientSecret: string) {
        this.clientID = AppClientID
        this.url = apiWebsite
        this.clientSecret = AppClientSecret
    }
}

export class AuthClient {
    token?: string
    refreshToken: string
    AppClient: AppClient
    scope = ['']

    //Ways to init
    //appAuth + RefreshToken + Token
    //appAuth + RefreshToken
    //clientId + appAuth (server -> refreshToken grab) //TODO: add without using SpotifyClient class as a backdoor of sorts
    //token (temp access)
    constructor(token = '', refreshToken: string, AppClient: AppClient) {
        this.token = token
        this.refreshToken = refreshToken
        this.AppClient = AppClient
    }
}