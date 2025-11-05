import express, { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../middleware/auth";
import { sendWelcomeEmail } from "../utils/mailer";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, wallet, role } = req.body;

    if (!email || !wallet || !role) {
      res.status(400).json({ message: "Email, wallet, and role are required" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { wallet }],
    });

    if (existingUser) {
      res.status(409).json({ message: "User already exists with this email or wallet" });
      return;
    }

    const newUser = new User({
      wallet: wallet.toLowerCase(),
      email: email.toLowerCase(),
      role,
      name: `User ${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
      carbonCredits: 0,
    });

    await newUser.save();

    await sendWelcomeEmail(newUser.email);

    const token = generateToken(newUser.wallet, newUser.role);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
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
    const { email, wallet } = req.body;

    if (!email || !wallet) {
      res.status(400).json({ message: "Email and wallet are required" });
      return;
    }

    let user = await User.findOne({
      $or: [{ email }, { wallet }],
    });

    if (!user) {
      user = new User({
        wallet: wallet.toLowerCase(),
        email: email.toLowerCase(),
        role: "user",
        name: `User ${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
        carbonCredits: 0,
      });
      await user.save();
    }

    const token = generateToken(user.wallet, user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
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
