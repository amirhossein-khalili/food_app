export interface CreateOrderParams {
  customerId: string;
  vendorId: string;
  items: any[];
  totalAmount: number;
  paidAmount: number;
  orderDate: Date;
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  readyTime: number;
}
