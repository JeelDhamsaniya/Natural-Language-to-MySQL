import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Database API
export const databaseAPI = {
  getTables: () => api.get("/database/tables"),
  getSchema: () => api.get("/database/schema"),
  getTableStructure: (tableName) =>
    api.get(`/database/tables/${tableName}/structure`),
  getTableData: (tableName, page = 1, limit = 50) =>
    api.get(`/database/tables/${tableName}/data?page=${page}&limit=${limit}`),
  createTable: (data) => api.post("/database/tables", data),
  insertData: (data) => api.post("/database/tables/data", data),
};

// Query API
export const queryAPI = {
  generateQuery: (naturalLanguage, previousQuery = null, feedback = null) =>
    api.post("/query/generate", { naturalLanguage, previousQuery, feedback }),
  executeQuery: (sql, analystMode = false, confirmed = false) =>
    api.post("/query/execute", { sql, analystMode, confirmed }),
  analyzeQuery: (sql) => api.post("/query/analyze", { sql }),
};

// Health check
export const healthCheck = () =>
  api.get("/health", { baseURL: "http://localhost:5000" });

export default api;
