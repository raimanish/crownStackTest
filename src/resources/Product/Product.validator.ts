import * as Joi from '@hapi/joi';

class ProductValidator {
    stringSchema = Joi.string();
    numberSchema = Joi.number();

    create = Joi.object().keys({
        name: this.stringSchema.required().max(100)
        .messages({
            "string.max": `"name" can have a maximum length of 100`,
        }),
        description: this.stringSchema.required().max(200)
        .messages({
            "string.max": `"description" can have a maximum length of 200`,
        }),
        price: this.numberSchema.required().greater(0),  //.pattern(new RegExp('^\d+\.\d{0,2}$')),
        make: this.numberSchema.required().integer().min(1900).max(new Date().getFullYear())
        .messages({
            "number.min": `"name" Year must be greater than 1900`,
            "number.max": `"name" Year can not be greater than current year`,
            "number.integer": "Year must be integer"
        }),
    });
}

export default new ProductValidator();