import { IsString } from 'class-validator';

export class CreatePaymentInput{
  @IsString()
  paymentMode: string;
}
