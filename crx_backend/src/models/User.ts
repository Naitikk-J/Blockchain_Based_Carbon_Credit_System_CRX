import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  wallet?: string; // Made wallet optional
  email: string;
  password?: string; // Made password optional for now
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
      unique: true,
      lowercase: true,
      sparse: true, // Allows multiple documents to have a null value for wallet
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
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

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")  || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err:any) {
    next(err);
  }
});

export const User = mongoose.model<IUser>("User", userSchema);