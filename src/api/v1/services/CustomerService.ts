import { Customer, CustomerDoc, Order } from '../models';
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

export const EmptyCustomerCart = async (id: string): Promise<CustomerDoc> => {
  const profile = await Customer.findById(id).populate('cart.food').exec();

  profile.cart = [] as any;
  const cartResult = await profile.save();

  return cartResult;
};

export const CalculateCartItems = async (id: string) => {
  const customer = await Customer.findById(id).populate('cart.food').exec();

  const cartItems = customer.cart;

  let totalPrice = 0;
  let vendorId = null;

  if (cartItems.length > 0) {
    vendorId = cartItems[0].food.vendorId;
    for (const cartItem of cartItems) {
      const foodPrice = parseFloat(cartItem.food.price);
      const quantity = cartItem.unit;
      totalPrice += foodPrice * quantity;
    }
  }

  return { totalPrice, vendorId, cartItems };
};

export const GetOrdersByCustomerId = async (id: string) => {
  return await Order.findById(id).populate('orders');
};
