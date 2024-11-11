import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const DISCOUNT_VALIDATOR = [
  body("expires") // FORMAT IS YYYY-MM-DD (ISO 8601)
    .custom((value) => {
            const inputDate = new Date(value); // Convert input string to Date object
            const today = new Date(); // Get today's date
        
            // If we need very specific hour (Currently at 00:00:00)
            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);
            if(inputDate < today) {
                return false;
            }
            return true;
        })
    .withMessage("DISCOUNT EXPIRY DATE MUST BE IN THE FUTURE"),

  body("percentage")
    .isNumeric()
    .withMessage("DISCOUNT PERCENTAGE MUST BE A NUMBER")
    .custom((value) => {
      if (value < 1 || value > 100) {
        return false;
      }
      return true;
    })
    .withMessage("DISCOUNT PERCENTAGE MUST BE BETWEEN 0 AND 100"),
  
    (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
