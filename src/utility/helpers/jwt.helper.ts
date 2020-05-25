import * as jwt from 'jsonwebtoken';
import * as env from '../system';

export class JwtHelper {

    public static newToken(id: number): any {
        return jwt.sign({
            id: id,
            expiresAt: Date.now()+(60*60*1000)
        },
            env.Environment.jwt.secret
        );
    }

    public static verifyToken(token: string): any {
        return new Promise((resolve, reject) => {
            if (token) {
                jwt.verify(token, env.Environment.jwt.secret, async (err, decodedToken: any) => {
                    if (err) {
                        return reject('Session Expire Error');
                    }
                    resolve(decodedToken);
                });
            } else {
                return reject('Session Expire: No token');
            }
        })
    }
}