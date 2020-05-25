import { BaseModel } from "../../utility/db";
import { User } from '../../utility/db/models/user.model';
import { JwtHelper } from "../../utility/helpers/jwt.helper";
import { Role } from "../../utility/db/models/role.model";
import UserValidator from './User.validator';
import { BootstrapDb } from '../../utility/helpers/BootstrapDb.helper';
import bcrypt from 'bcrypt';
import SequlizeConnection from "../../utility/db/SequlizeConnection";

export class UserHandler extends BaseModel {

    static async signUp(body) {
        try {
            const validate = UserValidator.SignUp.validate(body, { abortEarly: false } );
            if (validate.error) {
                throw new Error(validate.error.details.map((error) => error.message.replace(/\"/g, '')).join(', '));
            }
            const value = validate.value;
            const isUserExists:any = await User.findOne({ where: { email: value.email } });

            if(isUserExists){
                throw new Error('User already exist');
            }
            let user: any;

            const hash = await bcrypt.hashSync(value.password, 10);

            // await SequlizeConnection.sequelize.transaction(async (t) => {
                
                user = await User.create({
                    name: value.name,
                    email: value.email,
                    password: hash,
                    active: true, 
                });
            // })

            return { message: 'Sign up successfully' };
        } catch (error) {
            return error;
        }
    }

    static async login(body, userRole) {
        try {
            const validate = UserValidator.Login.validate(body, { abortEarly: false } );

            if (validate.error) {
                throw new Error(validate.error.details.map((error) => error.message.replace(/\"/g, '')).join(', '));
            }
            const value = validate.value;
            const user = await User.findOne({ 
                where: { email: value.email },
                include: [
                    {
                        model: Role,
                        where: { role: userRole }
                    }
                ]
            })
            if (!user) {
                throw new Error("Either email or password is wrong");
            }
            const isVerified = await bcrypt.compareSync(value.password, user.password)

            if (isVerified === false) {
                throw { status: 401, message: "Either email or password is wrong" };
            }
            const token = await JwtHelper.newToken(user.userId);
            return { token }
        } catch (e) {
            return e;
        }
    }
}

