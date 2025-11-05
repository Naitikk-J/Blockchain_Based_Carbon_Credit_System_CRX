import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  wallet: string;
  email: string;
  role: "authority" | "user";
  name: string;
  blog?: string;
  carbonCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    wallet: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["authority", "user"],
      default: "user",
    },
    name: {
      type: String,
      required: true,
    },
    blog: {
      type: String,
      default: "",
    },
    carbonCredits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
