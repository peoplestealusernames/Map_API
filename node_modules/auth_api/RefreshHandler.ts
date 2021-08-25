import { AppClient, AuthClient } from './AuthClass'
import { HttpsRequest } from 'http_api'

export async function RefreshToken(Client: AuthClient) {
    const data = {
        'client_id': Client.AppClient.clientID,
        'client_secret': Client.AppClient.clientSecret,
        'grant_type': 'refresh_token',
        'refresh_token': Client.refreshToken
    }
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    //TODO: error handling maybe
    const payload = await HttpsRequest(Client.AppClient.url + 'token', 'POST', options, data)
    if (payload.error)//TODO: universal handling
        throw new Error(payload.error_description)

    return new AuthClient(payload.token_type + " " + payload.access_token, payload.refresh_token, Client.AppClient)
}
