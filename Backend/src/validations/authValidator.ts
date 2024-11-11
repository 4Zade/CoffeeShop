import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const authValidator = {
  register: [
    body("email") // Validates email
      .isEmail()
      .withMessage("Invalid email format.")
      .notEmpty()
      .withMessage("Email must not be empty."),

    body("password") // Validates password
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must meet the following requirements.")
      .notEmpty()
      .withMessage("Password must not be empty."),

    body("first_name") // Validates first name
      .notEmpty()
      .withMessage("First name must not be empty.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("First name cannot contain any symbols."),

    body("last_name") // Validates last name
      .notEmpty()
      .withMessage("Last name must not be empty")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Last name cannot contain any symbols"),

    body("repeat_password") // Validates repeat password
      .notEmpty()
      .withMessage("Repeat password must not be empty")
      .custom((value, { req }) => {
        console.log(value, req.body.password);
        if (value !== req.body.password) {
          throw new Error("Passwords must match");
        }
        return true;
      }),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  passwordReset: [
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must meet the required criteria.")
      .notEmpty()
      .withMessage("Password must not be empty."),

    body("repeat_password")
      .notEmpty()
      .withMessage("Repeat password must not be empty.")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match");
        }
        return true;
      }),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  login: [
    body("email") // Validates email
      .isEmail()
      .withMessage("Invalid email format")
      .notEmpty()
      .withMessage("Email must not be empty"),

    body("password") // Validates password
      .notEmpty()
      .withMessage("Password must not be empty.")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must meet the following requirements."),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  password : [
    body("password") // Validates password
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must meet the following requirements.")
    .notEmpty()
    .withMessage("Password must not be empty."),
  ],
  settingsPasswordReset: [
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must meet the required criteria.")
      .notEmpty()
      .withMessage("Password must not be empty."),
    
    body("newPassword")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("New password must meet the required criteria.")
      .notEmpty()
      .withMessage("New password must not be empty."),
  
    body("confirmPassword")
      .notEmpty()
      .withMessage("Repeat password must not be empty.")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) { // Check against newPassword
          throw new Error("Passwords must match");
        }
        return true;
      }),
  
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],

  changeName: [
    body("first_name") // Validates first name
      .notEmpty()
      .withMessage("First name must not be empty.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("First name cannot contain any symbols."),
    
    body("last_name") // Validates last name
      .notEmpty()
      .withMessage("Last name must not be empty")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Last name cannot contain any symbols"),
    
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
};

export default authValidator;
