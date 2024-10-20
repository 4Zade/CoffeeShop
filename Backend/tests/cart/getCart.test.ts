import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userControllers from "../../src/controllers/userControllers";
import User from "../../src/models/userModel";
import { generateToken } from "../../src/utils/token";
import cookieParser from 'cookie-parser'; // Import cookie-parser

const app = express();
app.use(cookieParser()); // Use cookie-parser
app.use(express.json());
app.use("/test/cart", userControllers.getCart);

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

describe("Get Cart", () => {
  it("should retrieve the user's cart", async () => {
    const response = await request(app)
      .get("/test/cart")
      .set("Cookie", cookie); // Set the cookie correctly

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.message, "Succsefull");
    assert.strictEqual(response.body.data.items.length, 1);

    // Access the total correctly
    const totalValue = response.body.data.total['$numberDecimal'];

    // Assert that totalValue matches the expected string
    assert.strictEqual(totalValue, "100"); // Updated to match the actual decimal string value
  });

  it("should return 400 if user is not found", async () => {
    const invalidToken = generateToken("invalid@example.com", 999, ["user"], false);
    const response = await request(app)
      .get("/test/cart")
      .set("Cookie", [`jwt=${invalidToken}`]);

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.body.message, "User not found");
  });
});


