import routeUser from "./resources/User/User.route";
import routeAdminUser from "./resources/User/AdminUser.route";
import routeOrder from "./resources/Order/Order.route";
import routeProduct from "./resources/Product/Product.route";
import routeAdminProduct from "./resources/Product/AdminProduct.route";
// import { handleError, DbError } from "./utility/db";
import { IRoute, GET, expandRoutes } from "./utility/routes";

const allRoutes: IRoute[] = [
    {
        path: "/greet",
        type: GET,
        handler: async (req: any, res: any, next: any) => {
            res.send("Hello there, friend!");
        }
    },
    routeUser,
    routeAdminUser,
    routeProduct,
    routeAdminProduct,
    routeOrder,
];

export default function(app: any) {
    app.use("/api/v1/", expandRoutes(allRoutes));      

    // Swagger UI in the /docs route
    /*if (Environment.isDevelopment) {
        addSwagger(app, "/docs", "./");
    }*/

    // 404 route
    // app.get("*", async (req: any, res: any, next: any) => {
    //     let err = new Error(DbError.GenericNotFound);
    //     next(handleError(err));
    // });
}
