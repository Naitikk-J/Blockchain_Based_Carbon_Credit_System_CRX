import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  wallet: string;
  reason: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requestType: "mint" | "burn";
  createdAt: Date;
  updatedAt: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    wallet: {
      type: String,
      required: true,
      lowercase: true,
    },
    reason: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestType: {
      type: String,
      enum: ["mint", "burn"],
      default: "mint",
    },
  },
  { timestamps: true }
);

export const Request = mongoose.model<IRequest>("Request", requestSchema);
