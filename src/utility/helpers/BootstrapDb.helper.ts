import { Role } from "../db/models/role.model";
import * as env from '../system';
import { User } from "../db/models/user.model";
import { RoleUser } from "../db/models/roleUser.model";

import bcrypt from 'bcrypt';

export class BootstrapDb {

    static _SALT = 10;

    static async insertRole() {
        //code to insert roles
        for (let i = 0; i < env.Environment.roles.length; i++) {
            await Role.findOrCreate({ where: { role: env.Environment.roles[i] } });
        }
    }

    static async CreateAdmin() {
        //code to create Admin
        const isAdminExists = await User.findOne({ where: { email: 'admin@admin.com' } });
        if (isAdminExists) {
            console.log('User already exist with this email id');
            return;
        }
        const hash = await bcrypt.hashSync('admin', BootstrapDb._SALT)
        const user: any = await User.create({ name: 'crownStack', email: 'admin@admin.com', password: hash, actve: true });
        const role = await Role.findOne({ where: { role: 'Admin' } });
        await RoleUser.create({ userId: user.userId, roleId: role!.roleId})
    }

}