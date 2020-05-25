import { RouteType } from "./RouteType";
import { RouteFunction } from "./RouteFunctionTypes";
import { EndpointPermissionsFunc, ReturnedEndpointPermissionsFunc } from '../endpoint-permissions'

export interface IRoute {
    path: string;
    type: RouteType | RouteType[];
    permissions?: EndpointPermissionsFunc[] | ReturnedEndpointPermissionsFunc[];
    handler: RouteFunction;
}
