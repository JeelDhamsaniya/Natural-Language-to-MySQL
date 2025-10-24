import express from "express";
import {
  generateQuery,
  executeQuery,
  analyzeQuery,
} from "../controllers/queryController.js";
import {
  validateSQLSyntax,
  validateAnalystMode,
  checkDangerousQuery,
} from "../middlewares/queryValidator.js";

const router = express.Router();

// Generate SQL from natural language
router.post("/generate", generateQuery);

// Execute SQL query (with validation)
router.post(
  "/execute",
  validateSQLSyntax,
  validateAnalystMode,
  checkDangerousQuery,
  executeQuery
);

// Analyze query (explain plan)
router.post("/analyze", analyzeQuery);

export default router;
