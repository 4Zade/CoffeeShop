import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../models/userModel";
import Product, { ProductInterface } from "../models/productModel";
import { TokenInterface, verifyToken } from "../utils/token";
import toDecimal, { addDecimals, divideDecimals, multiplyDecimals, subtractDecimals } from "../utils/toDecimal";
import { sendContactEmail } from "../utils/email";
import mongoose from "mongoose";
import Discount, { DiscountInterface } from "../models/discountModel";
import { generateDiscountCode } from "../utils/idgen"; // r stands for random

interface CartTotalInterface {
  total: mongoose.Types.Decimal128;
  subtotal: mongoose.Types.Decimal128;
  discount: mongoose.Types.Decimal128;
  percentage: number;
}

const userControllers = {
  getUsers: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users: UserInterface[] = await User.find();
      res.status(200).json({
        status: "success",
        message: "All Users successfully retrieved",
        data: users,
      });
    } catch (err: unknown) {
      next(err);
    }
  },
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    const param: string | number = req.params.identifier;
    let user: UserInterface;

    try {
        user = await User.findOne({ email: param });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    const token:string = req.cookies.jwt; 
    const body = req.body;
    try {
      const decoded = verifyToken(token);
      
      if(body.password){
        return res.status(400).json({
          status: "error",
          message: "You cannot change your password using this route",
        })
      }

      const user: UserInterface = await User.findOneAndUpdate({ id: decoded.id }, body);
      
      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: body, 
      })
      }
    catch (err: unknown) {
      next(err);
    }
  },
  
  addAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const params: string | number = req.params.identifier;

    try {
      let user: UserInterface;
        user = await User.findOne({ email: params });


      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.roles.includes("user")) {
        return res.status(400).json({
          message: "User is not verified",
        });
      }

      if (user.roles.includes("admin")) {
        return res.status(400).json({
          message: "User is already an admin",
        });
      }

      user.roles.push("admin");
      await user.save();

      res.status(200).json({
        message: "User added to administrator role successfully"
      });
    } catch (err) {
      next(err);
    }
  },

  removeAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const params: string | number = req.params.identifier;

    try {
      let user: UserInterface;
        user = await User.findOne({ email: params });


      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.roles.includes("admin")) {
        return res.status(400).json({
          message: "User is not an admin",
        });
      }

      if (!user.roles.includes("user")) {
        return res.status(400).json({
          message: "User is not verified",
        });
      }

      user.roles = user.roles.filter((role: string) => role !== "admin");
      await user.save();

      res.json({
        message: "User removed from administrator role successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  contact: async (req: Request, res: Response, next: NextFunction) => {
    const { email, subject, message } = req.body;

    try {
      if (!email || !subject || !message) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      await sendContactEmail(email, subject, message);

      res.status(200).json({
        message: "Succesfull",
      });
    } catch (err: unknown) {
      next(err);
    }
  },
  getAdmins: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users: UserInterface[] = await User.find({
        roles: { $in: ["admin"] }
      });

      console.log(typeof users);
    
      if(!users.length) {
        return res.status(400).json({
          message: "No admins found",
        });
      }
      
      res.status(200).json({
        status: "success",
        message: "All Admins successfully retrieved",
        data: users,
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  addDiscount: async (req: Request, res: Response, next: NextFunction) => {
    let code: any = req.body.code
    let {percentage, expires} = req.body;

    try{
      if(!code){
        code = (await generateDiscountCode()).toString();
      }

      const existingCode = await Discount.findOne({ code });

      if(existingCode) {
        return res.status(400).json({
          status: "Discount code already in Use",
        });
      }

      if(!percentage){
        return res.status(400).json({
          status: "Discount percentage is required",
        });
      }

      if(!expires){
        expires = new Date(Date.now() + 7 *24 * 60 * 60 * 1000);
      }

      const discount = new Discount({
        code: code.toUpperCase(),
        percentage,
        expires,
      });

      await discount.save();
      res.status(200).json({
        status: "Discount added successfully",
        discount: discount
      });
    }
    catch (err: unknown) {
      next(err);
    }
  },
  deleteDiscount: async (req: Request, res: Response, next: NextFunction) => {
    const code = req.params.code.toUpperCase()

    try{
      const discount = await Discount.deleteOne({ code });

      if(discount.deletedCount === 0) {
        return res.status(400).json({
          status: "Discount code not found",
        });
      }
      res.status(200).json({
        status: "Discount code deleted successfully",
      });
    }
    catch (err: unknown) {
      next(err);
    }
  },
  editDiscount: async (req: Request, res: Response, next: NextFunction) => {
    const code = req.params.code.toUpperCase()
    const {new_code, percentage, expires} = req.body;

    try{
      const discount = await Discount.findOne({ code });

      if (!discount) {
        return res.status(400).json({
          status: "Discount code not found",
        });
      }

      if(new_code){
        discount.code = new_code.toUpperCase();
      }
      if(percentage){
        discount.percentage = percentage;
      }
      if(expires){
        discount.expires = expires;
      }

      await discount.save();

      res.status(200).json({
        status: "success",
        discount: discount
      });
  }
    catch (err: unknown) {
      next(err);
    }
  },
  getDiscountCodes: async function ( _req: Request, res: Response, next: NextFunction) {
    try {
      const discounts: DiscountInterface[] = await Discount.find({});

      if(!discounts) {
        return res.status(400).json({
          status: "No discounts found",
        });
      }

      const validDiscounts = await Promise.all(
        discounts.map(async discount => {
          if (discount.expires < new Date()) {
            await Discount.deleteOne({ code: discount.code });
            return null;
          }
          return discount;
        })
      );
  
      const filteredDiscounts = validDiscounts.filter(discount => discount !== null);
  
      res.status(200).json({
        message: "All discounts successfully retrieved",
        discounts: filteredDiscounts,
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  checkDiscount: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;
    const discountCode = req.params.code.toUpperCase();

    try {
      const decoded: TokenInterface = await verifyToken(token);

      const user = await User.findOne({ id: decoded.id });

      if (!user) {
        return res.status(400).json({
          status: "User not found",
        });
      }

      const discount = await Discount.findOne({ code: discountCode });
      if(!discount) {
        return res.status(400).json({
          status: "Discount code not found",
        });
      }

      if (discount.expires < new Date()) {
        return res.status(400).json({
          status: "Discount code expired",
        });
      }

      user.cart.code = discount.code;
      user.cart.percentage = discount.percentage;

      await user.save();

      res.status(200).json({
        status: "Discount code exists!",
        discount: discount
      });
    }
    catch (err: unknown) {
      next(err);
    }
  }
};

export default userControllers;
