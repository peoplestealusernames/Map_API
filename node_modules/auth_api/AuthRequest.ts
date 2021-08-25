import { RefreshToken } from './RefreshHandler'
import { HttpsRequest } from 'http_api'
import { AuthClient } from './AuthClass'

function RemoveUndefined(Obj: any) {
    Object.keys(Obj).forEach(key => Obj[key] === undefined && delete Obj[key])
    return Obj
}

function QueryHandler(Query: any) {
    if (!Query)
        return ''

    let QueryStri = ""
    Query = RemoveUndefined(Query)

    for (const k in Query) {
        if (QueryStri == "") {
            QueryStri += "?"
        } else {
            QueryStri += "&"
        }
        QueryStri += k + "=" + Query[k]
    }

    return QueryStri
}

//TODO: fix these errors list
// Pausing a already paused player returns a no return call (although this is not bad it should return already paused)

//TODO: Have call function do a loop back when token is no longer valid and have auth api revalidate
//TODO: have call function also do proper return codes with invalid scope
export function AuthRequest(Auth: AuthClient, URL: string, method: 'POST' | 'GET' | 'PUT', Query?: any, Body?: any): Promise<any> {
    URL += QueryHandler(Query)

    let options = {
        method,
        headers: {
            Authorization: Auth.token,
            'Content-Type': 'application/json'
        }
    }

    return promiseHandler(Auth, URL, options, method, Query, Body)
}

async function promiseHandler(Auth: AuthClient, URL: string, options: any, method: 'POST' | 'GET' | 'PUT', Query?: any, Body?: any): Promise<any> {
    let Req = await Call(Auth, URL, options, method, Query, Body)
    try {
        const Return = JSON.parse(Req)
        return Return
    } catch (e) { //TODO: acctual t/f as 204:good return nothing and cant be json but idk about the rest
        //return { error: 'no return' }
        return Req //TODO: IDK MAN
    }
}

async function Call(Auth: AuthClient, URL: string, options: any, method: 'POST' | 'GET' | 'PUT', Query?: any, Body?: any, Tries: number = 0): Promise<any> {
    try {
        return await HttpsRequest(URL, method, options, Body, Query)
    } catch (e) {
        //console.log(e)
        //console.log(e.error.message)
        let ErrRet = e.error
        if (ErrRet == '') {
            return { statusCode: e.statusCode, error: 'no return' } //Possible point of failure in future for now just returns status code
        }

        ErrRet = JSON.parse(ErrRet)

        const Err = ErrRet.error
        if (Tries > 5)
            return { error: 'idk man' }

        //TODO: use ANYTHING else
        if (Err.message == 'The access token expired' ||
            Err.message == 'No token provided' ||
            Err.message == 'Invalid access token') { //TODO: Something special for invalid client this is a hack solution
            //TODO: Maybe have a default playback device or have some option for example hub project (from error code)
            await RefreshToken(Auth)
            options.headers.Authorization = Auth.token
            return await Call(Auth, URL, options, method, Query, Body, Tries + 1)
        } else {
            throw new Error("\n" + JSON.stringify(Err.message))
        }
    }
}