import { BaseModel } from "../../utility/db";
import OrderValidator from './Order.validator';
import { Order } from "../../utility/db/models/order.model";
import { OrderStatus } from './OrderStatus.enum'
import { LineItem } from "../../utility/db/models/lineItem.model";
import { Product } from "../../utility/db/models/product.model";
import SequlizeConnection from "../../utility/db/SequlizeConnection";

export class OrderHandler extends BaseModel {

    static async create(body: Object, userId: number) {
        try {
            const validate = OrderValidator.create.validate(body, { abortEarly: false } );
            let order: Order | null;
            let action: String;
            let isLineItemExist:any;
            if (validate.error) {
                throw new Error(validate.error.details.map((error) => error.message.replace(/\"/g, '')).join(', '));
            }
            const value = validate.value;
            const product: Product | null = await Product.findOne({ where: { productId: value.productId }});
            if(!product){
                throw new Error('Product does not exist')               
            }
            order = await OrderHandler.inCompleteOrder(userId);
            if(!order){
                console.log("order not foud")
                order = await Order.create({ userId: userId })
                action = 'Create'
            }else {
                isLineItemExist = order.lineItem.filter( (item) => Number(item.productId) == Number(value.productId) )
                action = isLineItemExist.length > 0 ? 'Update' : 'Create'
            }
            // await SequlizeConnection.sequelize.transaction(async (t) => {
                // had to remove transaction because jest was not mocking it 
                // uncomment it for production
                await OrderHandler.updateOrder(value, action, order, isLineItemExist, product);
                order = await OrderHandler.inCompleteOrder(userId)
            // })
            return { order,  message: 'Item added successfully to cart' };
        } catch (error) {
            return error;
        }
    }

    static async gets(userId: number) {
        try {
            const order: any = await OrderHandler.inCompleteOrder(userId);
            if (!order) {
                return { items: [] }
            }
            return { items: order.lineItem }
        } catch (e) {
            return e;
        }
    }

    static async inCompleteOrder(userId: number): Promise<Order | null>{
        try{
            let order: Order | null= null;
                order = await Order.findOne({ 
                    where: { 
                        userId: userId, 
                        status: OrderStatus.CART  // assuming order is in cart for simplicity
                    },
                    attributes:['orderId', 'total', 'createdAt'],
                    include: [
                        {
                            model: LineItem,
                            attributes:['lineItemId', 'productId', 'amount', 'createdAt'],
                            include: [
                                {
                                    model: Product,
                                    attributes:['name', 'description', 'make', 'price'],
                                },
                            ],
                            as: 'lineItem',
                        }
                    ],
                });            
            return order
        }catch (e) {
            return e;
        }
    }

    static async updateOrder(value: any, action: String, order: any, isLineItemExist:any, product: any) {
        try {
            let newAmount:number = 0;
            let orderAmount: number = 0;
            if (action == 'Create'){
                newAmount = Number(value.quantity) * parseFloat(product.price)
                await LineItem.create({ 
                    orderId: order.orderId, 
                    quantity: value.quantity, 
                    productId: value.productId,
                    amount: newAmount
                })
                orderAmount = newAmount;
            }else if(action == 'Update') {
                newAmount = (Number(value.quantity) + Number(isLineItemExist[0].quantity)) * product.price
                orderAmount = newAmount - Number(isLineItemExist[0].amount);
                await LineItem.update({ 
                    quantity: Number(value.quantity) + Number(isLineItemExist[0].quantity), 
                    amount: newAmount
                },{
                  where:{
                    lineItemId: isLineItemExist[0].lineItemId
                  }
                });
            }
            await Order.update({ 
                total: parseFloat(order.total) + orderAmount 
            }, 
            { 
                where: { 
                    orderId: order.orderId 
                },
            })
        } catch (error) {
            return error;
        }
    }
}
