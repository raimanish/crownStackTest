export type RouteReqRes = (req: any, res: any) => Promise<void>;
export type RouteReqResNext = (req: any, res: any, next: any) => Promise<void>;

export type RouteFunction = RouteReqRes | RouteReqResNext;

export type RouteCallbackFunction<T> = (obj: T, req: any, res: any) => Promise<T>;
