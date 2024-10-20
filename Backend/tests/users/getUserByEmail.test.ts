// getUserByEmail.test.ts
import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userControllers from "../../src/controllers/userControllers";
import User from "../../src/models/userModel";

const app = express();
app.use(express.json());
app.use("/test/users/email/:email", userControllers.getUser);

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Adding initial user data for testing
before(async () => {
    const users = [
      {
        id: 1, // Ensure 'id' is provided
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "Password123.",
        lock: { attempts: 0, until: new Date(), count: 0 },
        isVerified: true,
        isAdmin: false,
        roles: ["User"],
      },
    ];
  
    // Save users to the in-memory database
    await User.insertMany(users);
  });
  
  describe("Get User By Email", () => {
    it("should return the user successfully when found", async () => {
      const response = await request(app).get("/test/users/email/john@example.com");
  
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.status, "success");
      assert.strictEqual(response.body.message, "User retrieved by email successfully");
      assert.strictEqual(response.body.data.email, "john@example.com"); // Check that the email matches
    });
  
    it("should return 404 if the user is not found", async () => {
      const response = await request(app).get("/test/users/email/nonexistent@example.com");
  
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.body.status, "error");
      assert.strictEqual(response.body.message, "User email not found");
    });
  });

