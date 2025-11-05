import express, { Request, Response } from "express";
import { User } from "../models/User";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/:wallet", async (req: Request, res: Response): Promise<void> => {
  try {
    const { wallet } = req.params;

    const user = await User.findOne({ wallet: wallet.toLowerCase() });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      wallet: user.wallet,
      email: user.email,
      name: user.name,
      blog: user.blog,
      carbonCredits: user.carbonCredits,
      role: user.role,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

router.put("/:wallet", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { wallet } = req.params;
    const { name, blog, email } = req.body;

    if (req.user?.wallet.toLowerCase() !== wallet.toLowerCase()) {
      res.status(403).json({ message: "You can only update your own profile" });
      return;
    }

    const user = await User.findOneAndUpdate(
      { wallet: wallet.toLowerCase() },
      {
        name: name || undefined,
        blog: blog || undefined,
        email: email || undefined,
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        wallet: user.wallet,
        email: user.email,
        name: user.name,
        blog: user.blog,
        carbonCredits: user.carbonCredits,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
