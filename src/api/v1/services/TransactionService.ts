import { CreateTransactionParams } from '../interfaces';
import { Transaction } from '../models';

export const CreateTransaction = async ({
  customerId,
  vendorId,
  orderId,
  orderValue,
  status,
  paymentMode,
  paymentResponse,
  items,
}: CreateTransactionParams) => {
  return await Transaction.create({
    customer: customerId,
    vendorId: vendorId,
    orderId: orderId,
    orderValue: orderValue,
    status: status,
    paymentMode: paymentMode,
    paymentResponse: paymentResponse,
    items: items,
  });
};

export const ValidateTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId).populate('items.food').exec();

  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== 'failed') {
      return { status: true, currentTransaction };
    }
  }
  return { status: false, currentTransaction };
};

export const ChangeTransactionStatusAndSetOrderId = async (
  txnId: string,
  status: string,
  orderId: string
) => {
  return await Transaction.findByIdAndUpdate(txnId, { status: status, orderId: orderId });
};

export const FindAllTransactions = async () => {
  const transactions = await Transaction.find();
  return transactions;
};

export const FindTransactionById = async (id: string) => {
  return await Transaction.findById(id);
};

export const FindAllTransactionsByCustomerId = async (id: string) => {
  return await Transaction.find({ customerId: id });
};
