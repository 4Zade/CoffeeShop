// getUserById.test.ts
import request from "supertest";
import express from "express";
import { describe, it, before, after, beforeEach} from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userControllers from "../../src/controllers/userControllers";
import User from "../../src/models/userModel";

const app = express();
app.use(express.json());
app.use("/test/users/:identifier", userControllers.getUser);

let mongoServer;

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });
  
  beforeEach(async () => {
    await User.deleteMany({}); // Clear users collection
  
    const users = [
      {
        id: 1,
        _id: new mongoose.Types.ObjectId(), // Ensure _id is unique
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
  
  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  describe("Get User By ID", () => {
      it("should return the user successfully when found", async () => {
        const user = await User.findOne({ email: "john@example.com" }); // Fetch the user to get the correct ID
    
        const response = await request(app).get(`/test/users/id/${user.id}`); // Use the correct user ID
    
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body.status, "success");
        assert.strictEqual(response.body.message, "User retrieved by ID successfully");
        assert.strictEqual(response.body.data._id, user._id.toString()); // Check that the ID matches
        assert.strictEqual(response.body.data.first_name, "John"); // Check first name
        assert.strictEqual(response.body.data.last_name, "Doe"); // Check last name
        assert.strictEqual(response.body.data.email, "john@example.com"); // Check email
      });
    
      it("should return 404 if the user is not found", async () => {
        const response = await request(app).get("/test/users/id/999"); // Request a non-existent user ID
    
        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(response.body.status, "error");
        assert.strictEqual(response.body.message, "User ID not found");
      });
    
      it("should return 400 for invalid user ID", async () => {
        const response = await request(app).get("/test/users/id/invalidID"); // Use an invalid ID
        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.body.status, "error");
        assert.strictEqual(response.body.message, "Invalid user ID");
      });
  });