import express, { Request, Response } from "express";
import { TokenInterface, verifyToken } from "../../utils/token";
import User, { UserInterface } from "../../models/userModel";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const decoded: TokenInterface = await verifyToken(token as string);

    const user: UserInterface = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (err: unknown) {
    res.status(400).json({
      message: "Invalid or expired token",
      error: err,
    });
  }
});

export default router;
