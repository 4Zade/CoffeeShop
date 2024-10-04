import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { TokenInterface, verifyToken } from "../../utils/token";
import User from "../../models/userModel";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    const decoded: TokenInterface = await verifyToken(token as string);
    console.log(decoded);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err: unknown) {
    console.log(err);
  }
});

export default router;
