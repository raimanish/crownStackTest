import { Table, Column, Model, ForeignKey, DataType} from 'sequelize-typescript';
import { User } from './user.model';
import { Role } from './role.model';

@Table({ modelName: 'role_user'})
export class RoleUser extends Model<RoleUser> {

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId: number;

    @ForeignKey(() => Role)
    @Column(DataType.INTEGER)
    roleId: number;

}