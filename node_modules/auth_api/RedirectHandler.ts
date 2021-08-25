import http from 'http'
import { URL } from 'url'
import { AppClient, AuthClient } from './AuthClass'
import { HttpsRequest } from 'http_api'

export function Redirect(AppClient: AppClient, CallBack: Function, redirect_uri = 'localhost:7777', CloseAfterGrab = true) {
    //TODO: Get scope and redirect_uri from code
    const requestListener = function (req: any, res: any) //TODO: port to website api when done
    {
        //TODO: impliment the /callback into variables
        if (req.url.startsWith('/callback')) {
            res.setHeader("Content-Type", "text/json")
            res.writeHead(200)
            res.end("THX M8")
            //TODO: anything better

            if (CloseAfterGrab)
                server.close()

            //TODO: find some way of fetching localhost in this function
            GetTokenFromCode(AppClient, "http://localhost:7777" + req.url).then((tok) => CallBack(tok))
        }
    }

    const server = http.createServer(requestListener);
    const split = redirect_uri.split(':')
    server.listen(Number(split[1]), split[0], () => {

    })
}

export async function GetTokenFromCode(AppClient: AppClient, url: string) {
    const code = new URL(url).searchParams.get('code')
    const data = {
        'client_id': AppClient.clientID,
        'client_secret': AppClient.clientSecret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': url.split('?')[0]
    }

    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const payload = await HttpsRequest(AppClient.url + 'token', 'POST', options, data)
    if (payload.error)//TODO: universal handling
        throw new Error(payload.error_description)
    return new AuthClient(payload.token_type + " " + payload.access_token, payload.refresh_token, AppClient)
}