import { IsString, IsNotEmpty, Length, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateVandorInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  foodType: string[];

  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  pincode: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @Length(10, 15)
  @IsNotEmpty()
  phone: string;

  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
}

export class VendorLoginInput {
  @IsString()
  @Length(10, 15)
  @IsNotEmpty()
  phone: string;

  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
}

export class EditVendorInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @Length(10, 15)
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  foodType: string[];
}

export interface VendorPayload {
  _id: string;
  phone: string;
  name: string;
}

export interface CreateOfferInputs {
  offerType: string;
  vendors: [any];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promocode: string;
  promoType: string;
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}
