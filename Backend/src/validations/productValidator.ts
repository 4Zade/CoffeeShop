import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const PRODUCT_VALIDATOR = [
  body("title")
    .isEmpty()
    .withMessage("PRODUCT TITLE CANNOT BE EMPTY")
    .isLength({ max: 256 })
    .withMessage("PRODUCT TITLE MUST BE LESS THAN 256 CHARACTERS"),

  body("description")
    .isEmpty()
    .withMessage("DESCRIPTION CANNOT BE EMPTY")
    .isLength({ max: 1024 })
    .withMessage("DESCRIPTION MUST BE LESS OR EQUAL TO 1024 CHARACTERS"),

  body("category")
    .isEmpty()
    .withMessage("CATEGORY CANNOT BE EMPTY")
    .isLength({ max: 256 })
    .withMessage("CATEGORY MUST BE LESS THAN 1024 CHARACTERS"),

  body("price")
    .isEmpty()
    .withMessage("PRODUCT TITLE CANNOT BE EMPTY")
    .isNumeric()
    .withMessage("PRICE MUST BE A NUMBER")
    .isInt({ min: 0, max: 9999.99 })
    .withMessage("The number must be between 0 and 9999,99."),

  body("size")
    .isEmpty()
    .withMessage("PRODUCT TITLE CANNOT BE EMPTY")
    .isNumeric()
    .withMessage("PRICE MUST BE A NUMBER")
    .isInt({ min: 0, max: 9999 })
    .withMessage("The number must be between 0 and 9999,99."),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
