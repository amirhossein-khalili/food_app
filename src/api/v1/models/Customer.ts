import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderDoc } from './Order';

export interface ICart {
  food: Schema.Types.ObjectId;
  unit: number;
}

export interface CustomerDoc extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  cart: [any];
}

const CustomerSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },

    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number },
    lng: { type: Number },
    cart: [
      {
        _id: false,
        food: { type: Schema.Types.ObjectId, ref: 'food', require: true },
        unit: { type: Number, require: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema);

export { Customer };
