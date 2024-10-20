import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User, { UserInterface } from "../../src/models/userModel";
import productControllers from "../../src/controllers/productControllers";
import bcrypt from "bcrypt";
import Products, { ProductInterface } from "../../src/models/productModel";
import cookieParser from "cookie-parser";
import toDecimal from "../../src/utils/toDecimal";
import { generateToken } from "../../src/utils/token";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/test/products", productControllers.getAllProducts);

let mongoServer: MongoMemoryServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Get all products", () => {
  let token: string;
  let cookie: string
  before(async () => {
    const hashedPassword: string = await bcrypt.hash("Password123.", 10);
    const user: UserInterface = new User({
      id: 12345678,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: hashedPassword,
      roles: ["user"],
      lock: { attempts: 0, count: 0, until: new Date() }, // Initial lock state
    });
    await user.save();

    const product1 = new Products({
      id: 5345,
      name: "coffee",
      description: "gud coffee",
      price: toDecimal(100),
      liked: 1
    });
    
    const product2 = new Products({
      id: 5346,
      name: "tea",
      description: "gud tea",
      price: toDecimal(100),
      liked: 1
    })
    
    await product1.save()
    await product2.save()
      
    token = generateToken("test@example.com", 1, ["user"], false);
    cookie = `thisissofake`;
  });

  it("should return 200 if products are returned", async () => {
    const response = await request(app).get("/test/products").set("Cookie", cookie)
    assert.strictEqual(response.statusCode, 200); // Using assert
    assert.strictEqual(response.body.message, "Success"); // Using assert
  });
 });
