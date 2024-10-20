import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../models/userModel";
import Product, { ProductInterface } from "../models/productModel";
import { TokenInterface, verifyToken } from "../utils/token";
import toDecimal, { addDecimals, divideDecimals, multiplyDecimals, subtractDecimals } from "../utils/toDecimal";
import { sendContactEmail } from "../utils/email";
import mongoose from "mongoose";
import Discount, { DiscountInterface } from "../models/discountModel";

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
      if (param.includes("@")) {
        user = await User.findOne({ email: param });
      }
      else {
        user = await User.findOne({ id: param });
      }

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
  
  addAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const params: string | number = req.params.identifier;

    try {
      let user: UserInterface;

      if (params.includes("@")) {
        user = await User.findOne({ email: params });
      } else {
        user = await User.findOne({ id: params });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.roles.includes("User")) {
        return res.status(400).json({
          message: "User is not verified",
        });
      }

      if (user.roles.includes("Admin")) {
        return res.status(400).json({
          message: "User is already an admin",
        });
      }

      user.roles.push("Admin");
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

      if (params.includes("@")) {
        user = await User.findOne({ email: params });
      } else {
        user = await User.findOne({ id: params });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.roles.includes("Admin")) {
        return res.status(400).json({
          message: "User is not an admin",
        });
      }

      if (!user.roles.includes("User")) {
        return res.status(400).json({
          message: "User is not verified",
        });
      }

      user.roles = user.roles.filter((role: string) => role !== "Admin");
      await user.save();

      res.json({
        message: "User removed from administrator role successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  getCart: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;

    try {
      const decoded: TokenInterface = await verifyToken(token);

      const user: UserInterface = await User.findOne({
        id: decoded.id,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "Succsefull",
        data: user.cart,
      });
    } catch (err) {
      next(err);
    }
  },

  addToCart: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;
    const productId: number = parseInt(req.params.productId);

    try {
      const decoded: TokenInterface = await verifyToken(token);

      const user: UserInterface = await User.findOne({
        id: decoded.id,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const product: ProductInterface = await Product.findOne({
        id: productId,
      });

      if (!product) {
        return res.status(400).json({
          message: "Product not found",
        });
      }

      const existingItem = user.cart.items.find(
        (item) => item.productId === productId,
      );

      if (existingItem) {
        existingItem.quantity++;
        existingItem.total = addDecimals(existingItem.total, product.price);
      } else {
        user.cart.items.push({
          productId,
          quantity: 1,
          total: product.price,
        });
      }

      if(!user.cart.total) {
        user.cart.total = toDecimal(0);
      }

      user.cart.total = addDecimals(user.cart.total, product.price);

      await user.save();

      res.status(200).json({
        message: "item added to cart",
      });
    } catch (err) {
      next(err);
    }
  },

  removeFromCart: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;
    const productId: number = parseInt(req.params.productId);

    try {
      const decoded: TokenInterface = await verifyToken(token);

      const user: UserInterface = await User.findOne({
        id: decoded.id,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const product: ProductInterface = await Product.findOne({
        id: productId,
      });

      if (!product) {
        return res.status(400).json({
          message: "Product not found",
        });
      }

      const existingItem = user.cart.items.find(
        (item) => item.productId === productId,
      );

      if (existingItem.quantity > 1) {
        existingItem.quantity--;
        existingItem.total = subtractDecimals(existingItem.total, product.price);
      }

      user.cart.items.filter((item) => item.productId !== productId);
      user.cart.total = subtractDecimals(user.cart.total, product.price);

      await user.save();

      res.status(200).json({
        message: "item removed",
      });
    } catch (err) {
      next(err);
    }
  },

  clearCart: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;

    try {
      const decoded: TokenInterface = await verifyToken(token);

      const user: UserInterface = await User.findOne({
        id: decoded.id,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      user.cart.items = [];

      user.cart.total = toDecimal(0);

      await user.save();
      res.status(200).json({
        message: "Cart cleared",
      });
    } catch (err) {
      next(err);
    }
  },

  cartTotal: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;

    try {
      let data: CartTotalInterface = {
        total: toDecimal(0),
        subtotal: toDecimal(0),
        discount: toDecimal(0),
        percentage: 0,
      };

      const decoded: TokenInterface = await verifyToken(token);

      const user: UserInterface = await User.findOne({
        id: decoded.id,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      data.subtotal = user.cart.total;

      const discountCode: DiscountInterface = await Discount.findOne({ code: user.cart.code });

      if (!discountCode) {
        discountCode.percentage = 0;
      }

      if (discountCode.percentage > 0) {
        const num = divideDecimals(toDecimal(discountCode.percentage), toDecimal(100));
        const discount = multiplyDecimals(data.subtotal, num);
        data.discount = discount;
        data.percentage = discountCode.percentage;
        data.total = subtractDecimals(data.subtotal, discount);
      }

      res.status(200).json({
        message: "Succsefull",
        data: data
      });
    }
    catch (err) {
      next(err);
    }
  },

  contact: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;
    const { subject, message } = req.body;
    try {
      let email: string;
      let decoded: TokenInterface = {} as TokenInterface;

      if(!token){
        email = req.body.email;
      }
      else {
        decoded = verifyToken(token);
        email = decoded.email;
      }

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
        role: "admin",
      });
      if(!users) {
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
  }
};

export default userControllers;
