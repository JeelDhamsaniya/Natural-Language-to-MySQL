/**
 * Request logging middleware
 */

export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // Log query details for database operations
  if (req.body.sql) {
    console.log(
      `  SQL: ${req.body.sql.substring(0, 100)}${
        req.body.sql.length > 100 ? "..." : ""
      }`
    );
  }

  next();
};

/**
 * Error logging middleware
 */
export const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, err.message);
  console.error("Stack:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default { requestLogger, errorLogger };
