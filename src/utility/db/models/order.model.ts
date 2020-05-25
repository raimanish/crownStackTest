import { Table, Column, Model, DataType, IsEmail, NotEmpty, AllowNull, BelongsToMany, AutoIncrement, PrimaryKey, HasMany, Default, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { User } from './user.model';
import { LineItem } from './lineItem.model';
import { OrderStatus } from '../../../resources/Order/OrderStatus.enum'

@Table({ modelName: 'order' })
export class Order extends Model<Order> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  orderId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @Default(0)
  @Column(DataType.DECIMAL(10,2))
  total: number;

  @Default(OrderStatus.CART)
  @Column(DataType.INTEGER)
  status: number

  @HasMany(() => LineItem)
  lineItem: LineItem[]

  @BelongsTo(() => User)
  user: User
}