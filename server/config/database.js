import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const sslOptions = process.env.DB_SSL === "true" ? {
  ca: fs.readFileSync("./ca.pem"),
  rejectUnauthorized: true
} : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslOptions
});

export const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to Aiven MySQL successfully");
    conn.release();
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
};


export default pool;
