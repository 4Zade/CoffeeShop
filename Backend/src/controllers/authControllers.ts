import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User, { UserInterface } from "../models/userModel";
import {
  generateToken,
  generateResetToken,
  verifyToken,
  TokenInterface,
  generateVerifyToken,
} from "../utils/token";
import { generateUserId } from "../utils/idgen";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email";

interface RegisterInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  repeat_password: string;
}

interface LoginInterface {
  email: string;
  password: string;
  remember: boolean;
}

interface ResetPasswordInterface {
  token: string;
  password: string;
  repeat_password: string;
}

interface ChangePasswordInterface {
  oldPassword: string;
  newPassword: string;
}

const authControllers = {
  //^ POST /api/v1/auth/register - Register route (registers user)
  register: async (req: Request, res: Response, next: NextFunction) => {
    // Request user data
    const { first_name, last_name, email, password, repeat_password }: RegisterInterface = req.body;

    try {

      // Check if user already exists
      const existingUser: UserInterface = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists.",
        });
      }

      // Generate custom user ID / Hash user password
      const id: number = await generateUserId();
      const hashedPassword: string = await bcrypt.hash(password, 10);

      // Create new User / save user to database
      const newUser: UserInterface = new User({
        id,
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      // Generate JWT token / Send verification email to users email
      const token: string = generateVerifyToken(email, newUser.id, newUser.roles);
      await sendVerificationEmail(email, token);

      res.status(200).json({
        message: "Registration successful. Please verify your email.",
      });

      const isProduction: boolean = process.env.NODE_ENV === "production";

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 60 * 60 * 1000,
        sameSite: "strict",
      })
    } catch (err: unknown) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/login - Login route (authenticates user)
  login: async (req: Request, res: Response, next: NextFunction) => {
    // Request user data
    const { email, password, remember }: LoginInterface = req.body;

    try {
      const user: UserInterface = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials: Provided email is not registered",
        });
      }

      if (user.lock.until > new Date()) {
        return res.status(401).json({
          message: "Too many login attempts. Please try again later.",
        });
      }

      const maxAttempts: number = user.lock.count > 0 ? 3 : 5;
      const lockTime: number = user.lock.count > 0 ? 10 * 60 * 1000 : 30 * 60 * 1000;

      if (!(await user.verifyPassword(password))) {
        user.lock.attempts++;

        if(user.lock.attempts >= maxAttempts) {
          user.lock.attempts = 0;
          user.lock.until = new Date(Date.now() + lockTime);
          user.lock.count++;
          await user.save();

          return res.status(401).json({
            message: "Invalid credentials: Too many login attempts. Please try again later.",
          });
        }

        await user.save();

        return res.status(401).json({
          message: "Invalid credentials: Incorrect password",
        });
      }

      const token: string = generateToken(email, user.id, user.roles, remember);
      const isProduction: boolean = process.env.NODE_ENV === "production";

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProduction,
        maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
        sameSite: "strict",
      });

      user.lock.count = 0;
      user.lock.attempts = 0;
      await user.save();

      res.status(200).json({
        message: "Login successful",
      });
    } catch (err) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/logout - Logout route (logs user out)
  logout: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("jwt");

      res.status(200).json({
        message: "Logout successful",
      });
    } catch (err) {
      next(err);
    }
  },

  //^ GET /api/v1/auth/status - Status route (checks if user is logged in)
  status: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;

    try {
      // Check for token
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized",
          authorized: false,
        });
      }

      const decoded: TokenInterface = verifyToken(token);

      const user: UserInterface = await User.findOne({ email: decoded.email });

      res.status(200).json({
        message: "Succesfull",
        authorized: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/verify/:token - Verify Email Route (Verifies user email)
  verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
    // Request user data
    const token: string = req.params.token;

    try {
      // Check for token
      const decoded: TokenInterface = verifyToken(token as string);

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
      if (user.roles.includes("User")) {
        return res.status(400).json({
          message: "Email is already verified",
        });
      }

      user.roles.push("User");
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
    const token: string = req.cookies.jwt;

    try {

      const decoded: TokenInterface = verifyToken(token as string);
      // Find user anc check if user exists
      const user: UserInterface = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check if user is already verified
      if (user.roles.includes("User")) {
        return res.status(400).json({
          message: "Email is already verified",
        });
      }

      //delete jwt token
      res.cookie("jwt", "", { maxAge: 0 });

      // Generate JWT token and send it to users email
      const newToken: string = await generateVerifyToken(user.email, user.id, user.roles);
      await sendVerificationEmail(user.email, newToken);

      res.status(200).json({
        message: "Verification email sent",
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/password/request-reset - Request Password Reset Route (Sends password reset email)
  requestPasswordReset: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // Request user data
    const { email }: { email: string } = req.body;

    try {
      // Find user and check if they exist
      const user: UserInterface = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Generate password reset token and send it to users email
      const token: string = await generateResetToken(email, user.id);
      sendPasswordResetEmail(email, token);

      res.status(200).json({
        message: "Password reset email sent",
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/password/reset - Reset Password Route (Resets user password)
  passwordReset: async (req: Request, res: Response, next: NextFunction) => {
    // Request user data
    const token: string = req.params.token;
    const { password, repeat_password }: ResetPasswordInterface = req.body;

    try {
      // Verify token
      const decoded: TokenInterface = verifyToken(token);

      // Find user and check if user exists
      const user: UserInterface = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Hash users new password and save it to database
      const hashedPassword: string = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        message: "Password reset successful",
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/password/change - Change Password Route (Changes user password)
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    // Request user data
    const token: string = req.cookies.jwt;
    const { oldPassword, newPassword }: ChangePasswordInterface = req.body;

    try {
      const decoded: TokenInterface = verifyToken(token);

      const user: UserInterface = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!(await user.verifyPassword(oldPassword))) {
        return res.status(400).json({
          message: "Old password is incorrect",
        });
      }

      const hashedPassword: string = await bcrypt.hash(newPassword, 10);
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
