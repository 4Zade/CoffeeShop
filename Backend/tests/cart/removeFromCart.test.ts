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
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser()); // Add cookie-parser
app.use(express.json());
app.use("/test/cart/:productId", userControllers.removeFromCart);

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

    const product = new Product({
        id: 101,
        name: "Product 101",
        price: 50.0,
        description: "Description for Product 101", // Required field
    });
    await product.save();

    // Generate token for the mock user
    token = generateToken(user.email, user.id, user.roles, false); // Generate JWT token
    cookie = `jwt=${token}`
    console.log('Token:', token); // Debug the token
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Remove From Cart", () => {
    it("should remove an item from the cart", async () => {
        const response = await request(app)
            .post("/test/cart/101")
            .set("Cookie", cookie) // Ensure token is passed correctly

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body.message, "item removed");
    });

    it("should return 400 if product is not found", async () => {
        const response = await request(app)
            .post("/test/cart/999")
            .set("Cookie", cookie)

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.body.message, "Product not found");
    });

    it("should return 400 if user is not found", async () => {
        const invalidToken = generateToken("invalid@example.com", 999, ["user"], false);
        const response = await request(app)
            .post("/test/cart/101")
            .set("Cookie", [`jwt=${invalidToken}`])

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.body.message, "User not found");
    });
});

