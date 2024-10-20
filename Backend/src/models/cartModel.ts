import mongoose from "mongoose";

export const cartItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
});

export interface CartItemInterface {
  productId: number;
  quantity: number;
  total: mongoose.Types.Decimal128;
}

export interface CartInterface extends mongoose.Document {
  items: CartItemInterface[];
  code: string;
  total: mongoose.Types.Decimal128;
}
