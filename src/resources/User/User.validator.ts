import * as Joi from '@hapi/joi';

class UserValidator {
    stringSchema = Joi.string();
    emailSchema = Joi.string().email();
    numberSchema = Joi.number();
    booleanSchema = Joi.boolean();

    SignUp = Joi.object().keys({
        name: this.stringSchema.allow('').allow(null).max(50).messages({
            "string.max": `"name" can have a maximum length of 50`,
        }),
        email: this.emailSchema.required(),
        password: this.stringSchema.required(),
    });

    Login = Joi.object().keys({
        email: this.emailSchema.required(),
        password: this.stringSchema.required(),
    });
}

export default new UserValidator();