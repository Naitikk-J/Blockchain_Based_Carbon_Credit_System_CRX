import express, { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/:wallet", async (req: Request, res: Response): Promise<void> => {
  try {
    const { wallet } = req.params;

    const transactions = await Transaction.find({
      $or: [{ from: wallet.toLowerCase() }, { to: wallet.toLowerCase() }],
    }).sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to, amount, txHash, type } = req.body;

    if (!from || !to || !amount || !txHash) {
      res.status(400).json({ message: "From, to, amount, and txHash are required" });
      return;
    }

    const existingTx = await Transaction.findOne({ txHash });
    if (existingTx) {
      res.status(409).json({ message: "Transaction already logged" });
      return;
    }

    const newTransaction = new Transaction({
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount,
      txHash,
      type: type || "transfer",
    });

    await newTransaction.save();

    res.status(201).json({
      message: "Transaction logged successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Log transaction error:", error);
    res.status(500).json({ message: "Failed to log transaction" });
  }
});

export default router;
