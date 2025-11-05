import express, { Request, Response } from "express";
import { CommunityPost } from "../models/CommunityPost";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, type, amount, wallet } = req.body;

    if (!title || !description || !type || !amount || !wallet) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!["buy", "sell"].includes(type)) {
      res.status(400).json({ message: "Type must be 'buy' or 'sell'" });
      return;
    }

    const newPost = new CommunityPost({
      title,
      description,
      type,
      amount,
      wallet: wallet.toLowerCase(),
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await CommunityPost.findById(id);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.wallet !== req.user?.wallet.toLowerCase()) {
      res.status(403).json({ message: "You can only delete your own posts" });
      return;
    }

    await CommunityPost.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

export default router;
