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
  executeQuery: (sql, analystMode = false, confirmationLevel = 0) =>
    api.post("/query/execute", { sql, analystMode, confirmationLevel }),
  analyzeQuery: (sql) => api.post("/query/analyze", { sql }),
};

// Health check
export const healthCheck = () => {
  const baseUrl = process.env.REACT_APP_API_URL 
    ? process.env.REACT_APP_API_URL.replace('/api', '') 
    : "http://localhost:5000";
  return axios.get(`${baseUrl}/health`);
};

export default api;
