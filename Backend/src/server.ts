import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

import StartDB from "./Database/MongoDB";

// Routes
import allRoutes from "./routes/index";

// Middlewares
import { loggerMiddleware } from "./middlewares/logger";

const PORT = process.env.PORT || 3000;

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Coffee Shop API",
      version: "1.0.0",
      description: "API Documentation for Coffee Shop",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

async function initializeDatabase() {
  try {
    await StartDB();
  } catch (err: unknown) {
    console.log(err);
  }
}

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(
        `[express] Server is running on port: http://localhost:${PORT}\n` +
        `[express] Server docs running on port: http://localhost:${PORT}/api-docs`
      );      
    });

    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({
        origin: 'http://cafe.zade.lt/',
        credentials: true,
      })
    );

    app.use(loggerMiddleware);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.use("/api/v1", allRoutes);

    // app.use(handleError500);
  } catch (err: unknown) {
    console.log(err);
  }
}

startServer();
