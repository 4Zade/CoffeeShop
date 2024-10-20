import request from "supertest";
import express from "express";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userControllers from "../../src/controllers/userControllers";

import User, { UserInterface } from "../../src/models/userModel";

const app = express();
app.use(express.json());
app.use("/test/admin/:identifier", userControllers.addAdmin);

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
    // Creating some users for the tests
    const users = [
      {
        id: 123456,
        first_name: "Jane",
        last_name: "Doe",
        email: "verifieduser@example.com",
        password: "Password123.",
        isVerified: true,
        roles: ["User"], // Ensure they only have "User" role
      },
      {
        id: 789012,
        first_name: "Unverified",
        last_name: "User",
        email: "unverifieduser@example.com",
        password: "Password123.",
        isVerified: false,
        roles: ["User"],
      },
      {
        id: 654321,
        first_name: "Admin",
        last_name: "User",
        email: "adminuser@example.com",
        password: "Password123.",
        isVerified: true,
        roles: ["Admin"],
      },
    ];

      // Saving users to the in-memory database
  await User.insertMany(users);
});

describe("Add Admin", () => {
    it("should return 200 if user is successfully added as admin", async () => {
      const response = await request(app).post("/test/admin").send({
        identifier: "123456", // A user that exists and is verified
      });
  
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.message, "User added to administrator role successfully");
  
      // Verifying that the user is now an admin
      const updatedUser = await User.findOne({ id: 123456 });
      assert.ok(updatedUser?.roles.includes("Admin"));
    });
  
    it("should return 404 if user is not found", async () => {
      const response = await request(app).post("/test/admin").send({
        identifier: "nonexistentuser@example.com",
      });
  
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.body.error, "User not found");
    });
  
    it("should return 400 if user is not verified", async () => {
      const response = await request(app).post("/test/admin").send({
        identifier: "unverifieduser@example.com", // Unverified user
      });
  
      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.body.message, "User is not verified");
    });
  
    it("should return 400 if user is already an admin", async () => {
      const response = await request(app).post("/test/admin").send({
        identifier: "adminuser@example.com", // A user that is already an admin
      });
  
      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.body.message, "User is already an admin");
    });
  
    it("should add user as admin using email identifier", async () => {
      // Create a new user in the setup phase or within this test case
      const newUser = await User.create({
        id: 987654,
        first_name: "New",
        last_name: "User",
        email: "newuser@example.com",
        password: "Password123.",
        isVerified: true,
        roles: ["User"],
      });
    
      const response = await request(app).post("/test/admin").send({
        identifier: "newuser@example.com", // Use the new user's email
      });
    
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.message, "User added to administrator role successfully");
    
      // Verify the user is now an admin
      const updatedUser = await User.findOne({ email: "newuser@example.com" });
      assert.ok(updatedUser?.roles.includes("Admin"));
    });    
  });