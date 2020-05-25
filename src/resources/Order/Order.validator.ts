import * as Joi from '@hapi/joi';

class UserValidator {
    stringSchema = Joi.string();
    emailSchema = Joi.string().email();
    numberSchema = Joi.number();
    booleanSchema = Joi.boolean();

    create = Joi.object().keys({
        productId: this.numberSchema.integer().required(),
        quantity: this.numberSchema.integer().min(1).max(10)
        .messages({
            "number.min": `"Quanity" must be greater than 0 `,
            "number.max": `"Quantity" must be less than or equal to 10`,
            "number.integer": "Quantity must be integer"
        }),
    });
}

export default new UserValidator();