import mongoose, { Schema, Document } from "mongoose";

export interface ICommunityPost extends Document {
  title: string;
  description: string;
  type: "buy" | "sell";
  amount: number;
  wallet: string;
  createdAt: Date;
  updatedAt: Date;
}

const communityPostSchema = new Schema<ICommunityPost>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    wallet: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export const CommunityPost = mongoose.model<ICommunityPost>("CommunityPost", communityPostSchema);
