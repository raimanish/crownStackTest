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
        price: this.stringSchema.required().pattern(new RegExp('^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$'))
        .messages({
            "string.pattern.base":`"price" must be greater than zero and can have max two decimal places"`, 
        }),
        make: this.numberSchema.required().integer().min(1900).max(new Date().getFullYear())
        .messages({
            "number.min": `"name" Year must be greater than 1900`,
            "number.max": `"name" Year can not be greater than current year`,
            "number.integer": "Year must be integer"
        }),
    });
}

export default new ProductValidator();
