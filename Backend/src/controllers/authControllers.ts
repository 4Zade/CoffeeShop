import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User, { UserInterface } from "../models/userModel";
import {
  generateToken,
  generateResetToken,
  verifyToken,
  TokenInterface,
} from "../utils/token";
import { generateUserId } from "../utils/idgen";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email";

const authControllers = {
  //^ POST /api/v1/auth/register - Register route (registers user)
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Request user data
      const { first_name, last_name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      // Generate custom user ID / Hash user password
      const id = await generateUserId();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new User / save user to database
      const newUser = new User({
        id,
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });

      newUser.save();

      // Generate JWT token / Send verification email to users email
      const token = await generateToken(email, newUser.id, newUser.roles);
      await sendVerificationEmail(email, token);

      res.status(200).json({
        message: "Registration successful. Please verify your email.",
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/login - Login route (authenticates user)
  login: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user: UserInterface = await User.findOne({ email });

      if (user.lock.until > new Date()) {
        return res.status(401).json({
          message: "Too many login attempts. Please try again later.",
        });
      }

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials: Provided email is not registered",
        });
      }

      const maxLockAttempts = user.lock.count > 0 ? 3 : 5;
      const lockTime = user.lock.count > 0 ? 5 * 60 * 1000 : 30 * 60 * 1000;

      if (!user.verifyPassword(password)) {
        user.lock.attempts++;

        if (user.lock.attempts >= maxLockAttempts) {
          user.lock.until = new Date(Date.now() + lockTime);
          user.lock.count++;
        }

        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      user.lock.attempts = 0;
      user.lock.until = new Date();
      user.lock.count = 0;
      await user.save();

      const token = generateToken(email, user.id, user.roles);
      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(200).json({
        message: "Login successful",
      });
    } catch (err) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/logout - Logout route (logs user out)
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });

      res.status(200).json({
        message: "Logout successful",
      });
    } catch (err) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/verify-email - Verify Email Route (Verifies user email)
  verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
    // Request user data
    const { token } = req.query;

    try {
      // Check for token
      const decoded: TokenInterface = await verifyToken(token as string);

      if (!decoded) {
        return res.status(400).json({
          message: "Invalid or expired token",
        });
      }

      // Find user and check if user exists
      const user: UserInterface = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check if user is already verified, if not verify user
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
      next(err);
    }
  },

  //^ POST /api/v1/auth/resend-verify - Resend Verify Email Route (Sends verification email)
  resendVerifyEmail: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // Request user data
    const { email } = req.body;

    try {
      // Find user anc check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check if user is already verified
      if (user.isVerified) {
        return res.status(400).json({
          message: "Email is already verified",
        });
      }

      // Generate JWT token and send it to users email
      const token = await generateToken(email, user.id, user.roles);
      await sendVerificationEmail(email, token);

      res.status(200).json({
        message: "Verification email sent",
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/request-password-reset - Request Password Reset Route (Sends password reset email)
  requestPasswordReset: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // Request user data
    const { email } = req.body;

    try {
      // Find user and check if they exist
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Generate password reset token and send it to users email
      const token = await generateResetToken(email, user.id);
      sendPasswordResetEmail(email, token);

      res.status(200).json({
        message: "Password reset email sent",
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/reset-password - Reset Password Route (Resets user password)
  passwordReset: async (req: Request, res: Response, next: NextFunction) => {
    // Request user data
    const { token, password } = req.body;

    try {
      // Verify token
      const decoded: TokenInterface = await verifyToken(token);

      // Find user and check if user exists
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Hash users new password and save it to database
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        message: "Password reset successful",
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/change-password - Change Password Route (Changes user password)
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    // Request user data
    const token = req.cookies.jwt;
    const { oldPassword, newPassword } = req.body;

    try {
      const decoded = verifyToken(token);

      const user: UserInterface = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      console.log(await user.verifyPassword(oldPassword));

      if (!(await user.verifyPassword(oldPassword))) {
        return res.status(400).json({
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        message: "Password changed successfully",
      });
    } catch (err: unknown) {
      next(err);
    }
  },
};

export default authControllers;