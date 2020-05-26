import { BaseModel } from "../../utility/db";
import ProductValidator from "./Product.validator";
import { Product } from "../../utility/db/models/product.model";

export class ProductHandler extends BaseModel {

    static async create(body: any) {
        try {
            const validate = ProductValidator.create.validate(body, { abortEarly: false } );

            if (validate.error) {
                throw new Error(validate.error.details.map((error) => error.message.replace(/\"/g, '')).join(', '));
            }
            const value = validate.value;

            await Product.create(value)

            return { message: 'Product added successfully' };
        } catch (error) {
            return error;
        }
    }


    static async gets(perPage='10', page='1'){
        try {
            let pageSkip = Number(perPage) * (Number(page) - 1);
            const products: any = await Product.findAll({ 
                limit: Number(perPage),
                offset: pageSkip,
                attributes: ['productId', 'name', 'price', 'make']
            });
            const total = await Product.count({}); 
            return { total, products}
        } catch (error) {
            return error;
        }
    }
 
}
