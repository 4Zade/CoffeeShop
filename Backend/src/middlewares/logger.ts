import { createLogger, format, transports } from "winston";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Define log file paths (logs folder inside src)
const infoLogPath = path.join(__dirname, "../logs", "info.log");
const errorLogPath = path.join(__dirname, "../logs", "error.log");

// Custom format for structured JSON logging
const jsonFormat = format.printf(({ message, timestamp, ...meta }) => {
  const logObject = {
    status: meta.status || "N/A", // Return 'N/A' if status is not provided
    message: message,
    user_id: meta.user_id || undefined, // Return undefined if user_id is not present
    order_id: meta.order_id || undefined,
    product_id: meta.product_id || undefined,
    created_at: timestamp,
  };
  return JSON.stringify(logObject); // Convert the log object to a JSON string
});

// Create the logger instance
const logger = createLogger({
  level: "info", // Log 'info' level and above (error, warn, info)
  format: format.combine(
    format.timestamp(), // Add timestamp
    jsonFormat, // Use custom JSON format
  ),
  transports: [
    new transports.File({ filename: errorLogPath, level: "error" }), // Log errors to error.log
    new transports.File({ filename: infoLogPath, level: "info" }), // Log info to info.log
  ],
});

// In development mode, also log to the console with colorized output
if (process.env.NODE_ENV === "development") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize log levels in the console
        format.timestamp(),
        jsonFormat,
      ),
    }),
  );
}

// Middleware to log requests and errors
const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Log request info
  logger.info("Request received", {
    status: res.statusCode,
    user_id: req.body.user_id, // Assuming user_id is sent in the body
    order_id: req.body.order_id, // Assuming order_id is sent in the body
    product_id: req.body.product_id, // Assuming product_id is sent in the body
  });

  // Log errors based on response status code
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      logger.error("Error occurred", {
        status: res.statusCode,
        message: res.statusMessage,
        user_id: req.body.user_id, // Assuming user_id is sent in the body
        order_id: req.body.order_id, // Assuming order_id is sent in the body
        product_id: req.body.product_id, // Assuming product_id is sent in the body
      });
    }
  });

  next();
};

export { logger, loggerMiddleware };
