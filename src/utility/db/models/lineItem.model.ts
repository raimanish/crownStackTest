import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, BeforeCreate, BelongsTo, ForeignKey, AfterCreate, AfterUpdate, BeforeUpdate} from 'sequelize-typescript';
import { Product } from './product.model';
import { Order } from './order.model';

@Table({ modelName: 'line_items' })
export class LineItem extends Model<LineItem> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  lineItemId: number;

  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  productId: number;

  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  orderId: number;

  @Column(DataType.INTEGER)
  quantity: number;

  @Column(DataType.DECIMAL(10, 2))
  amount: number

  @BelongsTo(() => Product)
  product: Product

  @BelongsTo(() => Order)
  order: Order

  // @BeforeCreate
  // static async addAmount(instance: LineItem) {
  //   const product:any = await Product.findOne({ where: { productId: instance.productId }})
  //   if(!product){
  //     throw new Error('Product does not exist')
  //   }
  //   instance.amount = Number(instance.quantity) * parseFloat(product.price)
  // }

  // @AfterCreate
  // static async updateTotal(instance: LineItem) {
  //   const order:any = await Order.findOne({ where: { orderId: instance.orderId }});
  //   if(!order){
  //     throw new Error('Order does not exist')
  //   }
  //   await Order.update(
  //     { 
  //       total: parseFloat(order.total) + Number(instance.amount)
  //     }, 
  //     { 
  //       where: {
  //         orderId: order.orderId
  //     }
  //   })
  // }

  // static async updateLineItemTotal(instance: LineItem) {
  //   const order:any = await Order.findOne({ where: { orderId: instance.orderId }});
  //   if(!order){
  //     throw new Error('Order does not exist')
  //   }
  //   await Order.update(
  //     { 
  //       total: parseFloat(order.total) + Number(instance.amount)
  //     }, 
  //     { 
  //       where: {
  //         orderId: order.orderId
  //     }
  //   })
  // }
}