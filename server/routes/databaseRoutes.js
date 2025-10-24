import express from "express";
import {
  getTables,
  getTableStructure,
  getDatabaseSchema,
  createTable,
  getTableData,
  insertData,
} from "../controllers/databaseController.js";

const router = express.Router();

// Get all tables
router.get("/tables", getTables);

// Get database schema
router.get("/schema", getDatabaseSchema);

// Get table structure
router.get("/tables/:tableName/structure", getTableStructure);

// Get table data
router.get("/tables/:tableName/data", getTableData);

// Create new table
router.post("/tables", createTable);

// Insert data into table
router.post("/tables/data", insertData);

export default router;
