import Express from "express";

import { GET, POST, PUT, PATCH, ROUTE, USE, DELETE, OPTIONS, HEAD, RouteType } from "./RouteType";
import { RouteFunction } from "./RouteFunctionTypes";
import { IRoute } from "./IRoute";
import { Auth } from "../../middleware/Auth";
import { EndpointPermissionsFunc, ReturnedEndpointPermissionsFunc } from "../endpoint-permissions";

// In progress ////
export const expandRoutes = (publicRoutes: IRoute[], privateRoutes: IRoute[] = []): Express.Router => {
    let router = Express.Router();

    const handlePublicRoute = (
        path: string,
        type: RouteType,
        permissions: EndpointPermissionsFunc[] | ReturnedEndpointPermissionsFunc[] | undefined,
        handler: RouteFunction
    ) => {
        permissions = permissions
            ? permissions
            : [
                  (_: any, __: any, next: any) => {
                      next();
                  }
              ];

        switch (type) {
            case GET:
                router.get(path, ...permissions, handler);
                break;
            case POST:
                router.post(path, ...permissions, handler);
                break;
            case PUT:
                router.put(path, ...permissions, handler);
                break;
            case PATCH:
                router.patch(path, ...permissions, handler);
                break;
            case DELETE:
                router.delete(path, ...permissions, handler);
                break;
            case OPTIONS:
                router.options(path, ...permissions, handler);
                break;
            case HEAD:
                router.head(path, ...permissions, handler);
                break;
            case ROUTE:
            case USE:
                router.use(path, ...permissions, handler);
                break;
            default:
                throw new Error(`Invalid protocol type: ${type}`);
        }
    };

    const handlePrivateRoute = (
        path: string,
        type: RouteType,
        permissions: EndpointPermissionsFunc[] | ReturnedEndpointPermissionsFunc[] | undefined,
        handler: RouteFunction
    ) => {
        permissions = permissions
            ? permissions
            : [
                  (_: any, __: any, next: any) => {
                      next();
                  }
              ];

        switch (type) {
            case GET:
                router.get(path, Auth, ...permissions, handler);
                break;
            case POST:
                router.post(path, Auth, ...permissions, handler);
                break;
            case PUT:
                router.put(path, Auth, ...permissions, handler);
                break;
            case PATCH:
                router.patch(path, Auth, ...permissions, handler);
                break;
            case DELETE:
                router.delete(path, Auth, ...permissions, handler);
                break;
            case OPTIONS:
                router.options(path, Auth, ...permissions, handler);
                break;
            case HEAD:
                router.head(path, Auth, ...permissions, handler);
                break;
            case ROUTE:
            case USE:
                router.use(path, Auth, ...permissions, handler);
                break;
            default:
                throw new Error(`Invalid protocol type: ${type}`);
        }
    };

    for (let { path, type, permissions, handler } of publicRoutes) {
        if (type instanceof Array) {
            for (let t of type) {
                handlePublicRoute(path, t, permissions, handler);
            }
        } else {
            handlePublicRoute(path, type, permissions, handler);
        }
    }

    for (let { path, type, permissions, handler } of privateRoutes) {
        if (type instanceof Array) {
            for (let t of type) {
                handlePrivateRoute(path, t, permissions, handler);
            }
        } else {
            handlePrivateRoute(path, type, permissions, handler);
        }
    }
    return router;
};
