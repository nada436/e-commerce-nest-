import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPasswordConfirmedConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedField] = args.constraints; 
    const object = args.object as any; 
    return value === object[relatedField]; 
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must match the ${args.constraints[0]}`; // Default error message
  }
}
import { registerDecorator, ValidationOptions } from 'class-validator';


export function IsPasswordConfirmed(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordConfirmed',
      target: object.constructor,
      propertyName,
      constraints: ['password'], // Specify that the confirmation should match the password field
      options: validationOptions,
      validator: IsPasswordConfirmedConstraint,
    });
  };
}
