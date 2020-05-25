import {Table, Column, Model, DataType, BelongsToMany, AutoIncrement, PrimaryKey} from 'sequelize-typescript';
import { User } from './user.model';
import { RoleUser } from './roleUser.model';
 
@Table({ modelName: 'role'})
export class Role extends Model<Role> { 

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  roleId:number;

  @Column(DataType.STRING)
  role:string;

  @BelongsToMany(() => User, () => RoleUser)
  user: User[];

}