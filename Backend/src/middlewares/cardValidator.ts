import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const CARD_VALIDATOR = [
  body("card_number")
    .isLength({ min: 13, max: 19 })
    .withMessage("CARD NUMBER MUST BE BETWEEN 13 AND 19 CHARACTERS")
    .notEmpty()
    .withMessage("CARD NUMBER CANNOT BE EMPTY"),

  body("cvv")
    .isLength({ min: 3, max: 4 })
    .withMessage("CVC/CVV 3 DIGITS, CID 4 DIGITS")
    .notEmpty()
    .withMessage("CVC/CVV CANNOT BE EMPTY"),

  body("expiry_date")
    .custom((value) => {
      // Example used : "05/27"
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear() % 1000; // 2024 / 1000 Liekana 0024 -> 24
      const month = parseInt(value.slice(0, 2), 10); // "05" -> 5
      const year = parseInt(value.slice(2, 4), 10); // "27" -> 27

      // 27   < 24              27   === 24             06    <= 05
      if (
        year < currentYear ||
        (year === currentYear && month <= currentMonth)
      ) {
        return false;
      }
      return true; // since 27 !< 24 OR 27 !== 24, it will be validated skipping IF statment
    })
    .withMessage("EXPIRED CARD")
    .notEmpty()
    .withMessage("EXPIRY DATE CANNOT BE EMPTY"),

  body("name")
    .isLength({ min: 3, max: 50 })
    .withMessage("NAME MUST BE BETWEEN 3 AND 50 CHARACTERS")
    .notEmpty()
    .withMessage("NAME CANNOT BE EMPTY"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
