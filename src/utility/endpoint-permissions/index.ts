import { User } from "../db/models/user.model";
import { Role } from "../db/models/role.model";
import { JwtHelper } from "../helpers/jwt.helper";

export interface EndpointPermissionsFunc {
    (req: any, res: any, next: any): any;
}

export interface ReturnedEndpointPermissionsFunc {
    (next: any): EndpointPermissionsFunc;
}

class EndpointPermissions {

    public static enableOnlyAdmin: EndpointPermissionsFunc = async (req: any, res: any, next: any) => {
        if (!req.headers.authorization) {
            res.status(401).send({ message: "Not Authorized" });
        } else {
            try {
                let token = req.headers.authorization.split(' ')[1];
                if (token) {
                    req.currentUser = { id: '' };
                    let decodedToken = await JwtHelper.verifyToken(token);
                    console.log(decodedToken);
                    const user = await User.findOne({
                        where: { userId: decodedToken.id },
                        include: [
                            {
                                model: Role,
                                where: { role: 'Admin' }
                            }
                        ]
                    });
                    if (!user) {
                        return res.status(401).send({ message: 'UnAuthorised' });
                    }

                    if(decodedToken.expiresAt < Date.now()){
                        return res.status(404).send({ message: 'Sessio Expire.Please login to continue' });
                    }
                    req.currentUser = { id: decodedToken.id };
                    next();
                }
    
            } catch (err) {
                console.log(err); // Log the actual error, could be something postgres Related
                res.status(401).send({ message: "Not Authorized" });
                return;
            }
        }
    };
}

export default EndpointPermissions;
