import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import {
  CartItem,
  CreateCustomerInput,
  EditCustomerProfileInput,
  UserLoginInput,
  CreatePaymentInput,
  OrderInputs,
} from '../dto';
import { GenerateSignature, ValidatePassword } from '../utils';
import {
  CalculateCartItems,
  CheckCustomerExists,
  CreateCustomer,
  EmptyCustomerCart,
  GetCustomerWithEmail,
  GetCustomerWithId,
  UpdateCustomer,
  ValidateTransaction,
  CreateOrder,
  ChangeTransactionStatusAndSetOrderId,
  CreateTransaction,
  GetOrdersByCustomerId,
} from '../services';
import { Customer, Food } from '../models';

/* ------------------------------------------------------------------------------------------------- */
/*                                       Auth Section                                                */
/* ------------------------------------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------------------------------------- */
/*                                       Cart Section                                                */
/* ------------------------------------------------------------------------------------------------- */

// export const AddToCartController = async (req: Request, res: Response, next: NextFunction) => {
//   const customer = req.user;

//   if (customer) {
//     const profile = await GetCustomerWithId(customer._id);
//     let cartItems = Array();

//     const { foodId, unit } = <CartItem>req.body;

//     const food = await GetFoodById(foodId);

//     if (food && profile != null) {
//       cartItems = profile.cart;

//       if (cartItems.length > 0) {
//         // check and update
//         let existFoodItems = cartItems.filter((item) => item.food._id.toString() === foodId);

//         if (existFoodItems.length > 0) {
//           const index = cartItems.indexOf(existFoodItems[0]);

//           if (unit > 0) {
//             cartItems[index] = { food, unit };
//           } else {
//             cartItems.splice(index, 1);
//           }
//         } else {
//           cartItems.push({ food, unit });
//         }
//       } else {
//         // add new Item
//         cartItems.push({ food, unit });
//       }

//       if (cartItems) {
//         profile.cart = cartItems as any;
//         const cartResult = await UpdateCustomer(customer._id, profile);
//         return res.status(200).json(cartResult.cart);
//       }
//     }
//   }

//   return res.status(404).json({ msg: 'Unable to add to cart!' });
// };

// export const GetCartController = async (req: Request, res: Response, next: NextFunction) => {
//   const customer = req.user;

//   console.log(customer);

//   if (customer) {
//     const profile = await GetCustomerWithId(customer._id);
//     if (profile) return res.status(200).json(profile.cart);
//   }

//   return res.status(400).json({ message: 'Cart is Empty!' });
// };

// export const DeleteCartController = async (req: Request, res: Response, next: NextFunction) => {
//   const customer = req.user;

//   if (customer) {
//     const cartResult = EmptyCustomerCart(customer._id);

//     return res.status(200).json(cartResult);
//   }

//   return res.status(400).json({ message: 'cart is Already Empty!' });
// };

export const AddToCartController = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    let cartItems = Array();

    const { foodId, unit } = <CartItem>req.body;

    const food = await Food.findById(foodId);

    if (food) {
      if (profile != null) {
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          // check and update
          let existFoodItems = cartItems.filter((item) => item.food._id.toString() === foodId);
          if (existFoodItems.length > 0) {
            const index = cartItems.indexOf(existFoodItems[0]);

            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          // add new Item
          cartItems.push({ food, unit });
        }

        if (cartItems) {
          profile.cart = cartItems as any;
          const cartResult = await profile.save();
          return res.status(200).json(cartResult.cart);
        }
      }
    }
  }

  return res.status(404).json({ msg: 'Unable to add to cart!' });
};

export const GetCartController = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await GetCustomerWithId(customer._id);

    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }

  return res.status(400).json({ message: 'Cart is Empty!' });
};

export const DeleteCartController = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const cartResult = EmptyCustomerCart(customer._id);

    return res.status(200).json(cartResult);
  }

  return res.status(400).json({ message: 'cart is Already Empty!' });
};

/* ------------------------------------------------------------------------------------------------- */
/*                                       Payment Section                                             */
/* ------------------------------------------------------------------------------------------------- */

export const CreatePaymentController = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  Validation Data  ----------------------------------------- */
  const paymentInputs = plainToClass(CreatePaymentInput, req.body);
  const validationError = await validate(paymentInputs, { validationError: { target: true } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  /* ----------------------------------------  get cart price  ----------------------------------------- */

  const customer = req.user;

  const { paymentMode } = paymentInputs;

  const { totalPrice, vendorId, cartItems } = await CalculateCartItems(customer._id);

  /* ---------------------------------------- create transaction ----------------------------------------- */

  if (vendorId === null) return res.status(400).json({ message: 'please first add item to cart' });
  else {
    const paymentResponse = 'Payment is cash on Delivery';
    const transaction = await CreateTransaction({
      customerId: customer._id,
      vendorId: vendorId,
      orderId: '',
      orderValue: totalPrice,
      status: 'OPEN',
      paymentMode: paymentMode,
      paymentResponse: paymentResponse,
      items: cartItems,
    });
    return res.status(200).json(transaction);
  }
};

/* ------------------------------------------------------------------------------------------------- */
/*                                       Order Section                                             */
/* ------------------------------------------------------------------------------------------------- */

export const CreateOrderController = async (req: Request, res: Response, next: NextFunction) => {
  /* ----------------------------------------  Validation Data  ----------------------------------------- */
  const orderInputs = plainToClass(OrderInputs, req.body);
  const validationError = await validate(orderInputs, { validationError: { target: true } });
  if (validationError.length > 0) return res.status(400).json(validationError);

  const customer = req.user;

  const { txnId } = orderInputs;

  if (customer) {
    /* ----------------------------------------  Validation transaction  ----------------------------------------- */
    const { status, currentTransaction } = await ValidateTransaction(txnId);
    if (!status) return res.status(404).json({ message: 'Error while Creating Order!' });

    /* ----------------------------------------  create order  ----------------------------------------- */
    const currentOrder = await CreateOrder({
      customerId: String(customer._id),
      vendorId: String(currentTransaction.vendorId),
      items: currentTransaction.items,
      totalAmount: currentTransaction.orderValue,
      paidAmount: currentTransaction.orderValue,
      orderDate: new Date(),
      orderStatus: 'Waiting',
      remarks: '',
      deliveryId: '',
      readyTime: 45,
    });

    /* ----------------------------------------  update transaction and customer  ----------------------------------------- */
    if (currentOrder !== null) {
      ChangeTransactionStatusAndSetOrderId(txnId, 'CONFIRMED', currentOrder._id);
      EmptyCustomerCart(customer._id);
      return res
        .status(200)
        .json({ message: 'Your order has been successfully registered.', order: currentOrder });
    }

    return res.status(400).json({ msg: 'Error while Creating Order' });
  }
};

export const GetOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const orders = await GetOrdersByCustomerId(customer._id);
    return res.status(200).json(orders);
  }

  return res.status(400).json({ msg: 'Orders not found' });
};
