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
 * Check if query needs confirmation (Two-step verification for dangerous queries)
 */
export const checkDangerousQuery = (req, res, next) => {
  const { sql, confirmationLevel = 0 } = req.body;

  const dangerous = isDangerousQuery(sql);

  // If dangerous and no confirmation, send first warning
  if (dangerous && confirmationLevel === 0) {
    return res.status(200).json({
      success: false,
      needsConfirmation: true,
      isDangerous: true,
      confirmationLevel: 1,
      warning:
        "⚠️ WARNING: This query will modify or delete data permanently. Please review carefully before proceeding.",
      sql: sql,
    });
  }

  // If dangerous and first confirmation only, require second confirmation
  if (dangerous && confirmationLevel === 1) {
    return res.status(200).json({
      success: false,
      needsConfirmation: true,
      isDangerous: true,
      confirmationLevel: 2,
      warning:
        "🚨 FINAL WARNING: This is a destructive operation that CANNOT be undone. Are you absolutely sure?",
      sql: sql,
    });
  }

  // If dangerous and second confirmation, allow execution
  if (dangerous && confirmationLevel === 2) {
    req.queryValidated = true;
    req.isDangerous = dangerous;
    return next();
  }

  // Not dangerous, proceed normally
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
