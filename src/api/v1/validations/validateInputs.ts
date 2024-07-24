import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const validateInputs = async (inputClass: any, inputData: any) => {
  const inputs = plainToClass(inputClass, inputData);
  const validationErrors = await validate(inputs, { validationError: { target: true } });
  if (validationErrors.length > 0) {
    return validationErrors;
  }
  return null;
};
