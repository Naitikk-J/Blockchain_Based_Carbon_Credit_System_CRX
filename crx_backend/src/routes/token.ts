import express, { Request, Response } from "express";
import { User } from "../models/User";
import { verifyToken, verifyAuthority } from "../middleware/auth";

const router = express.Router();

router.get("/balance/:wallet", async (req: Request, res: Response): Promise<void> => {
  try {
    const { wallet } = req.params;

    const user = await User.findOne({ wallet: wallet.toLowerCase() });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      wallet: user.wallet,
      balance: user.carbonCredits,
    });
  } catch (error) {
    console.error("Get balance error:", error);
    res.status(500).json({ message: "Failed to fetch balance" });
  }
});

router.post("/mint", verifyToken, verifyAuthority, async (req: Request, res: Response): Promise<void> => {
  try {
    const { to, amount } = req.body;

    if (!to || !amount) {
      res.status(400).json({ message: "To address and amount are required" });
      return;
    }

    let user = await User.findOne({ wallet: to.toLowerCase() });

    if (!user) {
      user = new User({
        wallet: to.toLowerCase(),
        email: `${to.toLowerCase()}@crx.local`,
        role: "user",
        name: `User ${to.slice(0, 6)}...${to.slice(-4)}`,
        carbonCredits: amount,
      });
    } else {
      user.carbonCredits += amount;
    }

    await user.save();

    res.status(200).json({
      message: "Tokens minted successfully",
      user: {
        wallet: user.wallet,
        balance: user.carbonCredits,
      },
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    });
  } catch (error) {
    console.error("Mint error:", error);
    res.status(500).json({ message: "Mint failed" });
  }
});

router.post("/burn", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;

    if (!amount) {
      res.status(400).json({ message: "Amount is required" });
      return;
    }

    const user = await User.findOne({ wallet: req.user?.wallet.toLowerCase() });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.carbonCredits < amount) {
      res.status(400).json({ message: "Insufficient balance" });
      return;
    }

    user.carbonCredits -= amount;
    await user.save();

    res.status(200).json({
      message: "Tokens burned successfully",
      user: {
        wallet: user.wallet,
        balance: user.carbonCredits,
      },
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    });
  } catch (error) {
    console.error("Burn error:", error);
    res.status(500).json({ message: "Burn failed" });
  }
});

router.post("/transfer", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { to, amount } = req.body;

    if (!to || !amount) {
      res.status(400).json({ message: "To address and amount are required" });
      return;
    }

    const fromUser = await User.findOne({ wallet: req.user?.wallet.toLowerCase() });

    if (!fromUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (fromUser.carbonCredits < amount) {
      res.status(400).json({ message: "Insufficient balance" });
      return;
    }

    let toUser = await User.findOne({ wallet: to.toLowerCase() });

    if (!toUser) {
      toUser = new User({
        wallet: to.toLowerCase(),
        email: `${to.toLowerCase()}@crx.local`,
        role: "user",
        name: `User ${to.slice(0, 6)}...${to.slice(-4)}`,
        carbonCredits: 0,
      });
    }

    fromUser.carbonCredits -= amount;
    toUser.carbonCredits += amount;

    await fromUser.save();
    await toUser.save();

    res.status(200).json({
      message: "Transfer successful",
      from: { wallet: fromUser.wallet, balance: fromUser.carbonCredits },
      to: { wallet: toUser.wallet, balance: toUser.carbonCredits },
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ message: "Transfer failed" });
  }
});

export default router;
