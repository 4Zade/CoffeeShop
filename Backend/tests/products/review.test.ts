import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import productControllers from "../../src/controllers/productControllers";

import Products, { ProductInterface } from "../../src/models/productModel";
import cookieParser from "cookie-parser";
import toDecimal from "../../src/utils/toDecimal";
import { generateToken } from "../../src/utils/token";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/test/products/review", productControllers.review);

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

describe("Get product by id", () => {
  let token: string;
  let cookie: string
  before(async () => {

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
      
    token = generateToken("test@example.com", 1, ["user"]);
    cookie = `thisissofake`;
  });

  it("should return 201 if product is returned", async () => {
    const response = await request(app).get("/test/products/review").set("Cookie", cookie).send({
    id: 5346,
  });
    assert.strictEqual(response.statusCode, 201); // Using assert
    assert.strictEqual(response.body.message, "Success"); // Using assert
  });
  it("should return 201 if product is returned", async () => {
    const response = await request(app).get("/test/products/review").set("Cookie", cookie).send({
    id: 5346,
  });
    assert.strictEqual(response.statusCode, 201); // Using assert
    assert.strictEqual(response.body.message, "Success"); // Using assert
  });
});