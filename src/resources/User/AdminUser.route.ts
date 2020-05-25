import { expandRoutes, IRoute, ROUTE, GET, POST, DELETE } from "../../utility/routes";
import { handleError } from "../../utility/db";
import { UserHandler } from "./User.handler";


const routesUsersPublic: IRoute[] = [
    {
        path: "/login",
        type: POST,
        handler: async (req: any, res: any, next: any) => {
            let results;
            try {
                results = await UserHandler.login(req.body, 'Admin');
                if (results instanceof Error) {
                    res.status(422).send({ message: results.message });
                } else if (results.status === 401) {
                    res.status(401).send({ message: results.message });
                } else
                    res.status(200).send(results);

            } catch (err) {
                next(handleError(err));
            }
        }
    },
];

const routesUsersPrivate: IRoute[] = [
];

export default {
    path: `/admin/user`,
    type: ROUTE,
    handler: expandRoutes(routesUsersPublic, routesUsersPrivate)
} as IRoute;
