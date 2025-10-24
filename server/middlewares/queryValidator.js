/**
 * Middleware to validate and classify SQL queries
 */

// Dangerous query patterns
const DANGEROUS_PATTERNS = [
  /\bDROP\s+TABLE\b/i,
  /\bDROP\s+DATABASE\b/i,
  /\bTRUNCATE\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bALTER\s+TABLE\b/i,
  /\bDROP\s+COLUMN\b/i,
  /\bDROP\s+INDEX\b/i,
];

// Read-only query patterns
const READ_ONLY_PATTERNS = [
  /^\s*SELECT\b/i,
  /^\s*SHOW\b/i,
  /^\s*DESCRIBE\b/i,
  /^\s*EXPLAIN\b/i,
];

/**
 * Check if query is dangerous
 */
export const isDangerousQuery = (sql) => {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(sql));
};

/**
 * Check if query is read-only
 */
export const isReadOnlyQuery = (sql) => {
  return READ_ONLY_PATTERNS.some((pattern) => pattern.test(sql));
};

/**
 * Validate query for analyst mode (only SELECT allowed)
 */
export const validateAnalystMode = (req, res, next) => {
  const { sql, analystMode } = req.body;

  if (analystMode && !isReadOnlyQuery(sql)) {
    return res.status(403).json({
      success: false,
      error: "Analyst mode only allows SELECT queries",
      isDangerous: false,
      needsConfirmation: false,
    });
  }

  next();
};

/**
 * Check if query needs confirmation
 */
export const checkDangerousQuery = (req, res, next) => {
  const { sql, confirmed } = req.body;

  const dangerous = isDangerousQuery(sql);

  // If dangerous and not confirmed, send warning
  if (dangerous && !confirmed) {
    return res.status(200).json({
      success: false,
      needsConfirmation: true,
      isDangerous: true,
      warning:
        "⚠️ This query will modify or delete data permanently. Are you sure you want to proceed?",
      sql: sql,
    });
  }

  // Mark as validated
  req.queryValidated = true;
  req.isDangerous = dangerous;
  next();
};

/**
 * Basic SQL injection prevention
 */
export const sanitizeQuery = (sql) => {
  // Remove multiple statements (prevent SQL injection via ;)
  const statements = sql.split(";").filter((s) => s.trim());

  if (statements.length > 1) {
    throw new Error("Multiple SQL statements are not allowed");
  }

  return statements[0].trim();
};

/**
 * Validate SQL syntax (basic)
 */
export const validateSQLSyntax = (req, res, next) => {
  const { sql } = req.body;

  if (!sql || typeof sql !== "string") {
    return res.status(400).json({
      success: false,
      error: "SQL query is required",
    });
  }

  try {
    // Basic validation
    const sanitized = sanitizeQuery(sql);
    req.body.sql = sanitized;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export default {
  isDangerousQuery,
  isReadOnlyQuery,
  validateAnalystMode,
  checkDangerousQuery,
  validateSQLSyntax,
  sanitizeQuery,
};
