// import { handleError } from "../db/ErrorHandlers";
import { POST, GET, PATCH, DELETE } from "./RouteType";
import { IRoute } from "./IRoute";

import { BaseModel } from "../db";
import { ClassType } from "../helpers";

const response = {message:true};

export function routeCRUDGenerator(classObject: ClassType): IRoute[] {
    return [
        routeCreateOne(classObject),
        routeReadAll(classObject),
        routeReadOne(classObject),
        routeUpdateOne(classObject),
        routeDeleteOne(classObject)
    ];
}

export function routeCreateOne<T extends BaseModel>(classObject: ClassType<T>): IRoute {
    return {
        path: "/",
        type: POST,
        handler: async (req, res, next) => {
            try {
             //   const response = await DAO.create(classObject.name, req.body, classObject);
                res.status(201).json(response);
            } catch (err) {
                // next(handleError(err));
            }
        }
    };
}

export function routeReadAll<T extends BaseModel>(classObject: ClassType<T>): IRoute {
    return {
        path: "/",
        type: GET,
        handler: async (req, res, next) => {
            try {
            //    const response = await DAO.findMany<T>(classObject.name, classObject);
                res.status(200).json(response);
            } catch (err) {
                // next(handleError(err));
            }
        }
    };
}

export function routeReadOne<T extends BaseModel>(classObject: ClassType<T>): IRoute {
    return {
        path: "/:id",
        type: GET,
        handler: async (req, res, next) => {
            try {
           //     const response: T = await DAO.findOneByID(classObject.name, req.params.id);
                res.status(200).json(response);
            } catch (err) {
                // next(handleError(err));
            }
        }
    };
}

export function routeUpdateOne<T extends BaseModel>(classObject: ClassType<T>): IRoute {
    return {
        path: "/:id",
        type: PATCH,
        handler: async (req, res, next) => {
            try {
                let objToUpdate: T = req.body;

              //  await.updateOneByID<T>(classObject.name, req.params.id, objToUpdate, classObject);
                res.status(207).json({
                    id: req.params.id,
                    ...objToUpdate
                });
            } catch (err) {
                // next(handleError(err));
            }
        }
    };
}

export function routeDeleteOne<T extends BaseModel>(classObject: ClassType<T>): IRoute {
    return {
        path: "/:id",
        type: DELETE,
        handler: async (req, res, next) => {
            try {
             //   await DAO.deleteOneByID(classObject.name, req.params.id);
                res.status(204).json();
            } catch (err) {
                // next(handleError(err));
            }
        }
    };
}
