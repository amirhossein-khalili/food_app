import { Transaction } from '../models';

export const CreateTransaction = async (
  customerId: string,
  vendorId: string,
  orderId: string,
  orderValue: number,
  status: string,
  paymentMode: string,
  paymentResponse: string
) => {
  return await Transaction.create({
    customer: customerId,
    vendorId: vendorId,
    orderId: orderId,
    orderValue: orderValue,
    status: status,
    paymentMode: paymentMode,
    paymentResponse: paymentResponse,
  });
};
