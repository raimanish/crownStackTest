import { User } from "../utility/db/models/user.model";
import { Role } from "../utility/db/models/role.model";
import { JwtHelper } from "../utility/helpers/jwt.helper";

/**
 * @description Auth Validation
 * @param req
 * @param res
 * @param next
 * @returns success and error any encountered
 */

export const Auth = async (req: any, res: any, next: any) => {
    if (!req.headers.authorization) {
        res.status(401).send({ message: "Not Authorized" });
    } else {
        try {
            let token = req.headers.authorization.split(' ')[1];
            if (token) {
                req.currentUser = { id: '' };
                let decodedToken = await JwtHelper.verifyToken(token);
                const user = await User.findOne({
                    where: { userId: decodedToken.id },
                    include: [
                        {
                            model: Role,
                            where: { role: 'User' }
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


