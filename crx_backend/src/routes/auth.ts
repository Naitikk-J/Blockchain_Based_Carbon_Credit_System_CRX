import express, { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../middleware/auth";
import { sendWelcomeEmail, sendPasswordEmail } from "../utils/mailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, wallet, role, name } = req.body;

    if (!email || !role || !name) {
      res.status(400).json({ message: "Email, name, and role are required" });
      return;
    }

    if (role === 'user' && !wallet) {
      res.status(400).json({ message: "Wallet is required for users" });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: "User already exists with this email" });
      return;
    }

    const password = crypto.randomBytes(8).toString('hex');

    const newUser = new User({
      wallet: wallet ? wallet.toLowerCase() : undefined,
      email: email.toLowerCase(),
      password,
      role,
      name,
      carbonCredits: 0,
    });

    await newUser.save();

    await sendPasswordEmail(newUser.email, password);

    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser.id,
        wallet: newUser.wallet,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user.id,
        wallet: user.wallet,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
