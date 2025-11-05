import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  from: string;
  to: string;
  amount: number;
  txHash: string;
  type: "mint" | "burn" | "transfer";
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    from: {
      type: String,
      required: true,
      lowercase: true,
    },
    to: {
      type: String,
      required: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["mint", "burn", "transfer"],
      default: "transfer",
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
