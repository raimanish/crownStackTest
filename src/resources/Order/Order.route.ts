import { expandRoutes, IRoute, ROUTE, GET, POST, DELETE } from "../../utility/routes";
// import { handleError } from "../../utility/db";
import { OrderHandler } from "./Order.handler";


const routesUsersPublic: IRoute[] = [
];

const routesUsersPrivate: IRoute[] = [
    {
        path: "/",
        type: POST,
        handler: async (req: any, res: any, next: any) => {
            try {
                let results = await OrderHandler.create(req.body, req.currentUser.id);
                if (results instanceof Error)
                    res.status(422).send({ message: results.message });
                else
                    res.status(200).send(results);
            } catch (err) {
                next((err));
            }
        }
    },
    {
        path: "/",
        type: GET,
        handler: async (req: any, res: any, next: any) => {
            let results;
            try {
                results = await OrderHandler.gets(req.currentUser.id);
                if (results instanceof Error) {
                    res.status(422).send({ message: results.message });
                } else if (results.status === 401) {
                    res.status(401).send({ message: results.message });
                } else
                    res.status(200).send(results);

            } catch (err) {
                next((err));
            }
        }
    }
];

export default {
    path: `/order`,
    type: ROUTE,
    handler: expandRoutes(routesUsersPublic, routesUsersPrivate)
} as IRoute;
