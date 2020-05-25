import { BaseModel } from "../../utility/db";
import OrderValidator from './Order.validator';
import { Order } from "../../utility/db/models/order.model";
import { OrderStatus } from './OrderStatus.enum'
import { LineItem } from "../../utility/db/models/lineItem.model";
import { Product } from "../../utility/db/models/product.model";
import SequlizeConnection from "../../utility/db/SequlizeConnection";

export class OrderHandler extends BaseModel {

    static async create(body, userId) {
        try {
            const validate = OrderValidator.create.validate(body, { abortEarly: false } );
            let order: any;
            let action: String;
            let isLineItemExist:any;
            if (validate.error) {
                throw new Error(validate.error.details.map((error) => error.message.replace(/\"/g, '')).join(', '));
            }
            const value = validate.value;
            order = await OrderHandler.inCompleteOrder(userId);
            if(!order){
                order = await Order.create({ userId: userId })
                action = 'Create'
            }else {
                isLineItemExist = order.lineItem.filter( (item) => Number(item.productId) == Number(value.productId) )
                action = isLineItemExist.length > 0 ? 'Update' : 'Create'
            }
            // await SequlizeConnection.sequelize.transaction(async (t) => {
                //console.log(action)
                if(action == 'Create'){

                    await LineItem.create({ 
                        orderId: order.orderId, 
                        quantity: value.quantity, 
                        productId: value.productId
                    },
                    
                    );
                }else{
                    const product: any = await Product.findOne({ where: { productId: value.productId }});
                    let newAmount:number = (Number(value.quantity) + Number(isLineItemExist[0].quantity)) * product.price

                    await LineItem.update({ 
                        quantity: Number(value.quantity) + Number(isLineItemExist[0].quantity), 
                        amount: newAmount
                    },{
                      where:{
                        orderId: order.orderId
                      }
                    });

                    await Order.update({ 
                        total: parseFloat(order.total) + (  newAmount - Number(isLineItemExist[0].amount))
                    }, 
                    { 
                        where: { 
                            orderId: order.orderId 
                        },
                    })
                }
            // });
            return { message: 'Item added successfully to cart' };
        } catch (error) {
            return error;
        }
    }

    static async gets(userId) {
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

    static async inCompleteOrder(userId): Promise<Order | null>{
        try{
            let order: Order | null= null;
                order = await Order.findOne({ 
                    where: { 
                        userId: userId, 
                        status: OrderStatus.CART 
                    },
                    include: [
                        {
                            model: LineItem,
                            include: [
                                {
                                    model: Product
                                }
                            ],
                            as: 'lineItem'
                        }
                    ],
                });            
            return order
        }catch (e) {
            return e;
        }
    }
}
