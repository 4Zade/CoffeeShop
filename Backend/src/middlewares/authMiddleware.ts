import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";

export default async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. You are not authenticated.",
      token: token,
    });
  }

  try {
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    return res.status(403).json({ message: "Invalid token." });
  }
}