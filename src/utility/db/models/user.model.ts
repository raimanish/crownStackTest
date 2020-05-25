import { Table, Column, Model, DataType, IsEmail, NotEmpty, AllowNull, BelongsToMany, AutoIncrement, PrimaryKey, HasMany, Default, AfterCreate } from 'sequelize-typescript';
import { Role } from './role.model';
import { RoleUser } from './roleUser.model';
import { Order } from './order.model';

@Table({ modelName: 'user' })
export class User extends Model<User> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.STRING)
  name: string;

  @IsEmail
  @AllowNull(true)
  @Column(DataType.STRING)
  email: string;

  @AllowNull
  @Column(DataType.STRING)
  password: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  active: boolean;
  
  @BelongsToMany(() => Role, () => RoleUser)
  role: Role[];

  @HasMany(() => Order)
  order: Order[]

  @AfterCreate
  static async addUserRole(instance: any){
    const role:any = await Role.findOne({ where: { role: 'User' } });
    RoleUser.create({ userId: instance.userId, roleId: role.roleId });
    
  }
}