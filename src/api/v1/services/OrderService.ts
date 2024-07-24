import { Order, OrderDoc } from '../models/Order';
import { CreateOrderParams } from '../interfaces/order.interface';

export const CreateOrder = async (orderData: CreateOrderParams) => {
  return await Order.create(orderData);
};
