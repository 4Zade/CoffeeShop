import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import authControllers from "../../src/controllers/authControllers";
import authValidator from "../../src/validations/authValidator";
import User, { UserInterface } from "../../src/models/userModel";

const app = express();
app.use(express.json());
app.use("/test/auth/register", authValidator.register, authControllers.register);

// let mongoServer: MongoMemoryServer;

// before(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();

//   await mongoose.connect(uri);
// });

// after(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

describe("Register", () => {
  before(async () => {
    const user: UserInterface = new User({
      id: 12345678,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "Password123.", // Use a hashed password in a real scenario
    });
    await user.save();
  });

  //^ Test if user gets successfully registered
  it("should return 200 if user gets successfully registered", async () => {
    const response = await request(app).post("/test/auth/register").send({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      password: "Password123.",
    });

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(
      response.body.message,
      "Registration successful. Please verify your email.",
    );
  });

  //^ Test if user with that email is already registered
  it("should return 400 if user with that email is already registered", async () => {
    const response = await request(app).post("/test/auth/register").send({
      first_name: "Jane",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "Password123.",
    });

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(
      response.body.message,
      "User with this email already exists.",
    );
  });
});
