import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import cartController from "../../src/controllers/cartController";
import User from "../../src/models/userModel";
import { signToken } from "../../src/utils/token";

const app = express();
app.use(express.json());
app.use("/test/cart/get", cartController.getCart);

let mongoServer: MongoMemoryServer;
let token: string;

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
    cart: { items: [], total: 0 },
  });
  await user.save();

  token = signToken({ id: 1 });
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Get Cart", () => {
  it("should retrieve the cart", async () => {
    const response = await request(app)
      .get("/test/cart/get")
      .set("Cookie", [`jwt=${token}`]);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.message, "Succsefull");
    assert.ok(response.body.data);
  });

  it("should return 400 if user not found", async () => {
    const badToken = signToken({ id: 999 });
    const response = await request(app)
      .get("/test/cart/get")
      .set("Cookie", [`jwt=${badToken}`]);

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.body.message, "User not found");
  });
});
