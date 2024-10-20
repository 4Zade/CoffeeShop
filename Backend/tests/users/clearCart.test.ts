import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userControllers from "../../src/controllers/userControllers";
import User from "../../src/models/userModel";
import { generateToken } from "../../src/utils/token";
import cookieParser from "cookie-parser"; // Add this import

const app = express();
app.use(cookieParser()); // Add cookie-parser middleware
app.use(express.json());
app.use("/test/cart/clear", userControllers.clearCart);

let mongoServer: MongoMemoryServer;
let token: string;
let cookie: string;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const user = new User({
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "test@example.com",
    password: "Password123.",
    cart: { items: [{ productId: 101, quantity: 2, total: 100 }], total: 100 },
    roles: ["user"],
  });
  await user.save();

  // Generate token for the mock user
  token = generateToken(user.email, user.id, user.roles, false); // Generate JWT token
  cookie = `jwt=${token}`
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Clear Cart", () => {
  it("should clear the user's cart", async () => {
      const response = await request(app)
          .post("/test/cart/clear")
          .set("Cookie", cookie);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.message, "Cart cleared");

      const updatedUser = await User.findOne({ email: "test@example.com" });
      assert.strictEqual(updatedUser.cart.items.length, 0);

      // Format the total to a string with two decimal places
      const totalAsString = (parseFloat(updatedUser.cart.total.toString()) || 0).toFixed(2);
      assert.strictEqual(totalAsString, "0.00"); // Check against the expected string
  });

  it("should return 400 if user is not found", async () => {
      const invalidToken = generateToken("invalid@example.com", 999, ["user"], false);
      const response = await request(app)
          .post("/test/cart/clear")
          .set("Cookie", [`jwt=${invalidToken}`]);

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.body.message, "User not found");
  });
});

