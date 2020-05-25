
import { ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";

export function IsUnique(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: "isUnique",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions || {
                message: `"${propertyName}" must be unique, but is already is use`
            },
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    let query = {
                        [propertyName]: value
                    };

                //    const result = await DAO.findOne(args.targetName, query);

              //      if (result) return false;
              //      else return true;
              return true;
                }
            }
        });
    };
}
