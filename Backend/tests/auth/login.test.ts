import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";

import authControllers from "../../src/controllers/authControllers";

import User, { UserInterface } from "../../src/models/userModel";
import { generateToken } from "../../src/utils/token";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/test/auth/login", authControllers.login);

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

describe("Login", () => {
  let token: string;
  let cookie: string;

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

    token = generateToken(user.email, user.id, user.roles, false);
    cookie = `jwt=${token}`;
  });

  //^ Test if user is logged in
  it("should return 200 if user is logged in", async () => {
    const response = await request(app)
    .post("/test/auth/login")
    .set("Cookie", cookie)
    .send({
      email: "john.doe@example.com",
      password: "Password123.",
    });

    assert.strictEqual(response.statusCode, 200); // Using assert
    assert.strictEqual(response.body.message, "Login successful"); // Using assert
  });

  //^ Test if email is not registered
  it("should return 401 if email is not registered", async () => {
    const response = await request(app).post("/test/auth/login").send({
      email: "wrong@example.com",
      password: "Password123.",
    });
    assert.strictEqual(response.statusCode, 401);
    assert.strictEqual(
      response.body.message,
      "Invalid credentials: Provided email is not registered",
    );
  });

  //^ Test if password is incorrect
  it("should return 401 if password is incorrect", async () => {
    const response = await request(app).post("/test/auth/login").send({
      email: "john.doe@example.com",
      password: "wrongpassword",
    });
    assert.strictEqual(response.statusCode, 401);
  });

  //^ Test if too many login attempts
  it("should lock user if too many login attempts", async () => {
    const maxAttempts = 5;

    for (let i = 0; i < maxAttempts; i++) {
      await request(app).post("/test/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });
    }

    const response = await request(app).post("/test/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    assert.strictEqual(response.statusCode, 401);
  });
});