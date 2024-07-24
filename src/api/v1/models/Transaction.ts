import mongoose, { Schema, Document, Model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface TransactionDoc extends Document {
  customer: string;
  vendorId: string;
  orderId: string;
  orderValue: number;
  offerUsed: string;
  status: string;
  paymentMode: string;
  paymentResponse: string;
  items: [any];
}

const TransactionSchema = new Schema(
  {
    customer: String,
    vendorId: String,
    orderId: String,
    orderValue: Number,
    offerUsed: String,
    status: String,
    paymentMode: String,
    paymentResponse: String,
    items: [
      {
        _id: false,
        food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
        unit: { type: Number, required: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

TransactionSchema.plugin(paginate);

const Transaction = mongoose.model<TransactionDoc, mongoose.PaginateModel<TransactionDoc>>(
  'Transactions',
  TransactionSchema,
  'transactions'
);

export { Transaction };
