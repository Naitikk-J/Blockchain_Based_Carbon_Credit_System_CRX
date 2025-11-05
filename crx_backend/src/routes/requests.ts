import express, { Request, Response } from "express";
import { Request as TokenRequest } from "../models/Request";
import { User } from "../models/User";
import { verifyToken, verifyAuthority } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, verifyAuthority, async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await TokenRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { wallet, reason, amount, requestType } = req.body;

    if (!wallet || !reason || !amount) {
      res.status(400).json({ message: "Wallet, reason, and amount are required" });
      return;
    }

    const newRequest = new TokenRequest({
      wallet: wallet.toLowerCase(),
      reason,
      amount,
      requestType: requestType || "mint",
      status: "pending",
    });

    await newRequest.save();

    res.status(201).json({
      message: "Request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ message: "Failed to submit request" });
  }
});

router.put("/:id/approve", verifyToken, verifyAuthority, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await TokenRequest.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    await User.findOneAndUpdate(
      { wallet: request.wallet },
      { $inc: { carbonCredits: request.amount } }
    );

    res.status(200).json({
      message: "Request approved successfully",
      request,
    });
  } catch (error) {
    console.error("Approve request error:", error);
    res.status(500).json({ message: "Failed to approve request" });
  }
});

router.put("/:id/reject", verifyToken, verifyAuthority, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await TokenRequest.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    res.status(200).json({
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({ message: "Failed to reject request" });
  }
});

export default router;
