import { AuthRequest, AuthClient } from 'auth_api'

//From HttpAPI
type ArrayItems<T> = T extends Array<infer I> ? I : never

type Methods = ArrayItems<[
    'ACL', 'BIND', 'CHECKOUT',
    'CONNECT', 'COPY', 'DELETE',
    'GET', 'HEAD', 'LINK',
    'LOCK', 'M-SEARCH', 'MERGE',
    'MKACTIVITY', 'MKCALENDAR', 'MKCOL',
    'MOVE', 'NOTIFY', 'OPTIONS',
    'PATCH', 'POST', 'PRI',
    'PROPFIND', 'PROPPATCH', 'PURGE',
    'PUT', 'REBIND', 'REPORT',
    'SEARCH', 'SOURCE', 'SUBSCRIBE',
    'TRACE', 'UNBIND', 'UNLINK',
    'UNLOCK', 'UNSUBSCRIBE'
]>

/*
function Caller<T extends keyof typeof Actions>(Client: AuthClient, action: T, options?: Options[T]) {
    Call(Client, RunRef, ActionMaps, action, options)
}
*/


export function Call(Client: AuthClient, RunRef: any, ActionMaps: any, action: any, options?: any) {
    let Body = undefined
    let Query = undefined

    const Map = ActionMaps[action]
    switch (Map.OptionsTo) {
        case ('BODY'):
            //console.log('Body', action)
            Body = options as object
            break
        case ("QUERY"):
            //console.log('Query', action)
            Query = options as object
            break
        case ('RUN'):
            //console.log('Run', action)
            return RunRef[action as keyof typeof RunRef](Client, options, Map)
        default:

            break
    }

    return AuthRequest(Client, Map.URL, Map.Method, Query, Body)
}

type ActionMapConfig = {
    Method: Methods,
    URL: string,
    OptionsTo: 'BODY' | 'QUERY' | 'RUN' | 'NONE'
}

export function makeCopyEnum<T extends { [P in keyof T]: ActionMapConfig }>(val: T): T {
    return val
}

export function makeEnum<T extends { [P in keyof T]: P }>(val: T): T {
    return val
}

export type KeyedBy<H, T extends { [P in keyof H]?: any }> = T

/* Example using spotify

const Actions = makeEnum({
    SKIP: 'SKIP',
    PAUSE: 'PAUSE',
    PLAY: 'PLAY',
    SEARCH: 'SEARCH',
    VOLUME: 'VOLUME',
    QUEUE: 'QUEUE',
    GETUSER: 'GETUSER',
    PLAYSONGSEARCH: 'PLAYSONGSEARCH',
})

type Options = KeyedBy<typeof Actions, {
    SKIP?: undefined
    PAUSE?: undefined
    PLAY?: PlayOptions
    SEARCH?: SearchOptions
    VOLUME?: VolumeOptions
    QUEUE?: QueueOptions
    GETUSER?: undefined
    PLAYSONGSEARCH?: PlaySearchOptions
}>

const ActionMaps = makeCopyEnum({
    [Actions.SKIP]: {
        Method: 'POST',
        URL: 'https://api.spotify.com/v1/me/player/next',
        OptionsTo: 'NONE'
    },
    [Actions.PAUSE]: {
        Method: 'PUT',
        URL: 'https://api.spotify.com/v1/me/player/pause',
        OptionsTo: 'NONE'
    },
    [Actions.PLAY]: {
        Method: 'PUT',
        URL: 'https://api.spotify.com/v1/me/player/play',
        OptionsTo: 'BODY'
    },
    [Actions.SEARCH]: {
        Method: 'GET',
        URL: 'https://api.spotify.com/v1/search',
        OptionsTo: 'QUERY'
    },
    [Actions.VOLUME]: {
        Method: 'PUT',
        URL: 'https://api.spotify.com/v1/me/player/volume',
        OptionsTo: 'QUERY'
    },
    [Actions.QUEUE]: {
        Method: 'POST',
        URL: 'https://api.spotify.com/v1/me/player/queue',
        OptionsTo: 'QUERY'
    },
    [Actions.GETUSER]: {
        Method: 'GET',
        URL: 'https://api.spotify.com/v1/me',
        OptionsTo: 'NONE'
    },
    [Actions.PLAYSONGSEARCH]: {
        Method: 'GET',
        URL: 'track',
        OptionsTo: 'RUN'
    }
})

type PlaySearchOptions = {
    q: string | string[],
}

type PlayOptions = {
    context_uri?: string,
    uris?: string[],
    offset?: any,
    position_ms?: number
}

type SearchOptions = {
    q: string,
    type: string,
    limit?: number,
    offset?: number,
    market?: string,
    include_external?: string
}

type VolumeOptions = {
    volume: number,
}

type QueueOptions = {
    uri: string,
}

const RunRef = {
    [Actions.PLAYSONGSEARCH]: PlaySearch //Function
}
*/