import { IsEnum, IsString, IsNumber } from 'class-validator';

export class OrderInputs {
  @IsString()
  txnId: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  ACCEPTED = 'accepted',
  FINISHED = 'finished',
}

export class ChangeOrderStatus {
  @IsString()
  orderId: string;

  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsNumber()
  time: number;

  @IsString()
  remarks: string;
}
