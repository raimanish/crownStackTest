export enum RouteType {
    GET, // get
    POST, // create
    PUT, // create or update
    PATCH, // update
    DELETE, // delete
    OPTIONS, // info about api
    HEAD, // header only, get metadata for caching purposes
    USE
}

export const GET = RouteType.GET;
export const POST = RouteType.POST;
export const PUT = RouteType.PUT;
export const PATCH = RouteType.PATCH;
export const DELETE = RouteType.DELETE;
export const OPTIONS = RouteType.OPTIONS;
export const HEAD = RouteType.HEAD;
export const USE = RouteType.USE;
export const ROUTE = RouteType.USE;
