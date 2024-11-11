import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const EMAIL_VALIDATOR = [
  body("identifier") // not sure about which body
    .isEmail()
    .withMessage("Invalid email format."),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
