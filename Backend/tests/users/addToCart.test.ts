import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userControllers from "../../src/controllers/userControllers";
import User from "../../src/models/userModel";
import Product from "../../src/models/productModel";
import { generateToken } from "../../src/utils/token";
import cookieParser from "cookie-parser"; // <-- Ensure cookie-parser is imported

const app = express();
app.use(express.json());
app.use(cookieParser()); // <-- Add cookie-parser middleware
app.use("/test/cart/:productId", userControllers.addToCart);

let mongoServer: MongoMemoryServer;
let token: string;
let cookie: string;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user
  const user = new User({
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "test@example.com",
    password: "Password123.",
    cart: {
      items: [],
      total: mongoose.Types.Decimal128.fromString("0"), // Initialize total as Decimal128
    },
    roles: ["user"],
  });
  await user.save();

  // Create a test product
  const product = new Product({
    id: 101,
    name: "Product 101",
    price: mongoose.Types.Decimal128.fromString("50.00"),
    description: "A great product to test adding to cart.",
  });
  await product.save();

  token = generateToken(user.email, user.id, user.roles, false); // Generate JWT token
  cookie = `jwt=${token}`
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Add to Cart", () => {
  it("should add an item to the cart", async () => {
    const response = await request(app)
      .post("/test/cart/101")
      .set("Cookie", cookie) // <-- Ensure the cookie is set correctly

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.message, "item added to cart");

    const updatedUser = await User.findOne({ email: "test@example.com" });
    assert.strictEqual(updatedUser.cart.items.length, 1);
    assert.strictEqual(updatedUser.cart.items[0].productId, 101);
    assert.strictEqual(updatedUser.cart.items[0].quantity, 1);
    assert.strictEqual(updatedUser.cart.total.toString(), "50");
  });

  it("should return 400 if product is not found", async () => {
    const response = await request(app)
      .post("/test/cart/999")
      .set("Cookie", [`jwt=${token}`]);

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.body.message, "Product not found");
  });
});
