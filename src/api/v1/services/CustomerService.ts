import { Customer, CustomerDoc } from '../models';
import { GeneratePassword, GenerateSalt } from '../utils';
import { CreateCustomerInput, EditCustomerProfileInput, UserLoginInput } from '../dto';

export const CreateCustomer = async (input: CreateCustomerInput): Promise<CustomerDoc> => {
  const { email, password, phone } = input;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const customer = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    firstName: '',
    lastName: '',
    address: '',
    verified: true,
    lat: 0,
    lng: 0,
    orders: [],
  });

  return customer;
};

export const CheckCustomerExists = async (input: CreateCustomerInput) => {
  const { email } = input;

  const customerExists = await Customer.exists({ email });

  return customerExists;
};

export const GetCustomerWithEmail = async (input: UserLoginInput): Promise<CustomerDoc> => {
  const { email } = input;

  const customer = await Customer.findOne({ email: email });

  return customer;
};

export const GetCustomerWithId = async (id: string): Promise<CustomerDoc> => {
  const customer = await Customer.findById(id);

  return customer;
};

export const UpdateCustomer = async (
  id: string,
  input: EditCustomerProfileInput
): Promise<CustomerDoc> => {
  const { firstName, lastName, address } = input;

  const customer = await Customer.findByIdAndUpdate(id, {
    firstName: firstName,
    lastName: lastName,
    address: address,
  });

  return customer;
};
