import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { CreateCustomerInput, EditCustomerProfileInput, UserLoginInput } from '../dto';
import { GenerateSignature, ValidatePassword } from '../utils';
import {
  CheckCustomerExists,
  CreateCustomer,
  GetCustomerWithEmail,
  GetCustomerWithId,
  UpdateCustomer,
} from '../services';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  Validation Data  ----------------------------------------- */

  const customerInputs = plainToClass(CreateCustomerInput, req.body);
  const validationError = await validate(customerInputs, { validationError: { target: false } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  /* ----------------------------------------  Check User Existing  ----------------------------------------- */

  const customerExists = await CheckCustomerExists(customerInputs);
  if (customerExists) return res.status(400).json({ message: 'Email already exist!' });

  /* ----------------------------------------  Create User and Signature  ----------------------------------------- */

  const customer = await CreateCustomer(customerInputs);
  if (customer) {
    const signature = await GenerateSignature({
      _id: customer._id,
      email: customer.email,
      verified: customer.verified,
    });

    /* ----------------------------------------  sending success response to user  ----------------------------------------- */

    return res.status(201).json({ signature, verified: customer.verified, email: customer.email });
  }

  /* ---------------------------------------- Return Error to User  ----------------------------------------- */
  return res.status(400).json({ msg: 'Error while creating user' });
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  Validation Data  ----------------------------------------- */
  const customerInputs = plainToClass(UserLoginInput, req.body);
  const validationError = await validate(customerInputs, { validationError: { target: true } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  /* ----------------------------------------  Validation Data  ----------------------------------------- */

  const { email, password } = customerInputs;
  const customer = await GetCustomerWithEmail(customerInputs);

  if (customer) {
    const validation = await ValidatePassword(password, customer.password, customer.salt);

    if (validation) {
      const signature = await GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(200).json({
        signature,
        email: customer.email,
        verified: customer.verified,
      });
    }
  }

  return res.json({ msg: 'Please Use Signup first' });
};

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await GetCustomerWithId(customer._id);

    if (profile) return res.status(201).json(profile);
  }

  return res.status(500).json({ msg: 'Error while Fetching Profile' });
};

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  /* ----------------------------------------  Validation Data  ----------------------------------------- */

  const customerInputs = plainToClass(EditCustomerProfileInput, req.body);
  const validationError = await validate(customerInputs, { validationError: { target: true } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  if (customer) {
    /* ----------------------------------------  Check Profile And Update Customer  ----------------------------------------- */
    const profile = await GetCustomerWithId(customer._id);

    if (profile) {
      const result = await UpdateCustomer(customer._id, customerInputs);

      return res.status(200).json(result);
    }
  }
  return res.status(400).json({ msg: 'Error while Updating Profile' });
};
