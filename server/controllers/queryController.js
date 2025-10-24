import pool from "../config/database.js";
import { generateSQLWithAI, generateFallbackSQL } from "../config/aiService.js";

/**
 * Generate SQL query from natural language
 */
export const generateQuery = async (req, res) => {
  try {
    const { naturalLanguage, previousQuery = null, feedback = null } = req.body;

    if (!naturalLanguage) {
      return res.status(400).json({
        success: false,
        error: "Natural language query is required",
      });
    }

    // Get database schema for context
    const [tables] = await pool.query("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);

    // Build schema context
    let schemaContext = "Available tables:\n";

    for (const tableName of tableNames) {
      const [columns] = await pool.query(`DESCRIBE ${tableName}`);
      schemaContext += `\n${tableName}:\n`;
      columns.forEach((col) => {
        schemaContext += `  - ${col.Field} (${col.Type})${
          col.Key === "PRI" ? " PRIMARY KEY" : ""
        }\n`;
      });
    }

    // Include feedback if provided
    let enhancedQuery = naturalLanguage;
    if (feedback) {
      enhancedQuery = `${naturalLanguage}\nUser feedback: ${feedback}`;
    }

    // Generate SQL using AI
    const result = await generateSQLWithAI(
      enhancedQuery,
      schemaContext,
      previousQuery
    );

    res.json({
      success: true,
      data: {
        sql: result.sql,
        explanation: result.explanation,
        naturalLanguage: naturalLanguage,
      },
    });
  } catch (error) {
    console.error("Generate query error:", error);

    // Fallback to simple generation
    try {
      const [tables] = await pool.query("SHOW TABLES");
      const tableNames = tables.map((t) => Object.values(t)[0]);
      const fallback = generateFallbackSQL(
        req.body.naturalLanguage,
        tableNames
      );

      if (fallback.sql) {
        return res.json({
          success: true,
          data: {
            sql: fallback.sql,
            explanation: fallback.explanation,
            naturalLanguage: req.body.naturalLanguage,
            fallback: true,
          },
        });
      }
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
    }

    res.status(500).json({
      success: false,
      error:
        "Failed to generate SQL query. Please check your AI API key or try a simpler query.",
    });
  }
};

/**
 * Execute SQL query
 */
export const executeQuery = async (req, res) => {
  try {
    const { sql, analystMode = false } = req.body;

    if (!sql) {
      return res.status(400).json({
        success: false,
        error: "SQL query is required",
      });
    }

    // Execute query
    const startTime = Date.now();
    const [rows] = await pool.query(sql);
    const executionTime = Date.now() - startTime;

    // Determine if query modified data
    const isModification =
      /^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE)/i.test(sql);

    res.json({
      success: true,
      data: rows,
      rowCount: Array.isArray(rows) ? rows.length : rows.affectedRows,
      executionTime: `${executionTime}ms`,
      isModification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      sqlError: true,
    });
  }
};

/**
 * Analyze query (explain plan)
 */
export const analyzeQuery = async (req, res) => {
  try {
    const { sql } = req.body;

    if (!sql) {
      return res.status(400).json({
        success: false,
        error: "SQL query is required",
      });
    }

    // Get query execution plan
    const [explanation] = await pool.query(`EXPLAIN ${sql}`);

    res.json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default {
  generateQuery,
  executeQuery,
  analyzeQuery,
};
