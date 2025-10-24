import pool from "../config/database.js";

/**
 * Get all tables in the database
 */
export const getTables = async (req, res) => {
  try {
    const [tables] = await pool.query("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);

    res.json({
      success: true,
      data: tableNames,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get table structure (columns, types, keys)
 */
export const getTableStructure = async (req, res) => {
  try {
    const { tableName } = req.params;

    // Get columns
    const [columns] = await pool.query(`DESCRIBE ${tableName}`);

    // Get foreign keys
    const [foreignKeys] = await pool.query(
      `
      SELECT 
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `,
      [tableName]
    );

    res.json({
      success: true,
      data: {
        columns,
        foreignKeys,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get database schema (all tables with their structures)
 */
export const getDatabaseSchema = async (req, res) => {
  try {
    const [tables] = await pool.query("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);

    const schema = {};

    for (const tableName of tableNames) {
      const [columns] = await pool.query(`DESCRIBE ${tableName}`);
      schema[tableName] = columns;
    }

    res.json({
      success: true,
      data: schema,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Create a new table
 */
export const createTable = async (req, res) => {
  try {
    const { tableName, columns, foreignKeys = [] } = req.body;

    if (!tableName || !columns || columns.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Table name and columns are required",
      });
    }

    // Build CREATE TABLE query
    let query = `CREATE TABLE ${tableName} (`;

    // Add columns
    const columnDefs = columns.map((col) => {
      let def = `${col.name} ${col.type}`;

      if (col.primaryKey) {
        def += " PRIMARY KEY";
      }
      if (col.autoIncrement) {
        def += " AUTO_INCREMENT";
      }
      if (col.notNull) {
        def += " NOT NULL";
      }
      if (col.unique) {
        def += " UNIQUE";
      }
      if (col.default !== undefined && col.default !== "") {
        def += ` DEFAULT ${col.default}`;
      }

      return def;
    });

    query += columnDefs.join(", ");

    // Add foreign keys
    if (foreignKeys.length > 0) {
      const fkDefs = foreignKeys.map(
        (fk) =>
          `FOREIGN KEY (${fk.column}) REFERENCES ${fk.referenceTable}(${fk.referenceColumn})`
      );
      query += ", " + fkDefs.join(", ");
    }

    query += ")";

    await pool.query(query);

    res.status(201).json({
      success: true,
      message: `Table ${tableName} created successfully`,
      query: query,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get table data with pagination
 */
export const getTableData = async (req, res) => {
  try {
    const { tableName } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM ${tableName}`
    );
    const total = countResult[0].total;

    // Get data
    const [rows] = await pool.query(
      `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Insert data into table
 */
export const insertData = async (req, res) => {
  try {
    const { tableName, data } = req.body;

    if (!tableName || !data) {
      return res.status(400).json({
        success: false,
        error: "Table name and data are required",
      });
    }

    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => "?").join(", ");

    const query = `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Data inserted successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default {
  getTables,
  getTableStructure,
  getDatabaseSchema,
  createTable,
  getTableData,
  insertData,
};
