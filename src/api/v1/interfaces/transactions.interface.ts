export interface CreateTransactionParams {
  customerId: string;
  vendorId: string;
  orderId: string;
  orderValue: number;
  status: string;
  paymentMode: string;
  paymentResponse: string;
  items: any;
}
