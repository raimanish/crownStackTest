import { expandRoutes, IRoute, ROUTE, POST } from "../../utility/routes";
// import { handleError } from "../../utility/db";
import { ProductHandler } from "./Product.handler";
import EndpointPermissions from "../../utility/endpoint-permissions";


const routesUsersPublic: IRoute[] = [
    {
        path: "/",
        type: POST,
        permissions: [EndpointPermissions.enableOnlyAdmin],
        handler: async (req: any, res: any, next: any) => {
            let results;
            try {
                results = await ProductHandler.create(req.body);
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
    },
];

const routesUsersPrivate: IRoute[] = [
];

export default {
    path: `/admin/product`,
    type: ROUTE,
    handler: expandRoutes(routesUsersPublic, routesUsersPrivate)
} as IRoute;
