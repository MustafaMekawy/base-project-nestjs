import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
@ValidatorConstraint({ name: 'MaxWord', async: false })
export class MaxWordsInSentenceConstraint
  implements ValidatorConstraintInterface
{
  validate(sentence: string, args: ValidationArguments) {
    if (!args.constraints) return true;
    const numberOfWords = args.constraints[0];
    const nameParts = sentence.trim().split(/\s+/);
    return nameParts.length <= numberOfWords;
  }

  defaultMessage(args: ValidationArguments) {
    return `Name should not exceed ${args?.constraints[0]}  words`;
  }
}
