import { IsEmail, Length, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}

export class UserLoginInput {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class EditCustomerProfileInput {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class CartItem {
  @IsString()
  foodId: string;

  @IsNumber()
  unit: number;
}

export class CreateDeliveryUserInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;

  @Length(3, 12)
  firstName: string;

  @Length(3, 12)
  lastName: string;

  @Length(6, 24)
  address: string;

  @Length(4, 12)
  pincode: string;
}
