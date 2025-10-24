import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generate SQL query and explanation from natural language using Google Gemini 2.0 Flash
 * @param {string} naturalLanguage - User's natural language query
 * @param {string} schemaContext - Database schema context
 * @param {string} previousQuery - Previous query for context (optional)
 * @returns {object} - { sql: string, explanation: string }
 */
export const generateSQLWithAI = async (
  naturalLanguage,
  schemaContext,
  previousQuery = null
) => {
  try {
    const prompt = buildPrompt(naturalLanguage, schemaContext, previousQuery);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    return parseAIResponse(generatedText);
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate SQL from AI service");
  }
};

/**
 * Build prompt for AI model
 */
const buildPrompt = (naturalLanguage, schemaContext, previousQuery) => {
  let prompt = `You are an expert MySQL query generator. Your task is to convert natural language questions into valid MySQL queries.

DATABASE SCHEMA:
${schemaContext}

IMPORTANT INSTRUCTIONS:
1. Generate ONLY valid MySQL syntax
2. Use proper JOIN syntax when joining tables
3. Use table aliases for better readability
4. Always include a semicolon at the end of the query
5. For aggregate functions, use proper GROUP BY clauses
6. RESPOND IN THIS EXACT FORMAT (no extra text):

SQL: <the mysql query>
EXPLANATION: <one line explanation of what the query does>

`;

  if (previousQuery) {
    prompt += `PREVIOUS QUERY FOR CONTEXT:
${previousQuery}

`;
  }

  prompt += `USER QUESTION: ${naturalLanguage}

Now generate the MySQL query and explanation:`;

  return prompt;
};

/**
 * Parse AI response to extract SQL and explanation
 */
const parseAIResponse = (text) => {
  try {
    console.log("AI Response:", text); // Debug log

    // Try multiple patterns to extract SQL
    let sql = null;

    // Pattern 1: SQL: ```sql ... ```
    let sqlMatch = text.match(/SQL:\s*```sql\s*([\s\S]*?)\s*```/i);
    if (sqlMatch) {
      sql = sqlMatch[1].trim();
    }

    // Pattern 2: SQL: `query`
    if (!sql) {
      sqlMatch = text.match(/SQL:\s*`([^`]+)`/i);
      if (sqlMatch) {
        sql = sqlMatch[1].trim();
      }
    }

    // Pattern 3: SQL: query (single line)
    if (!sql) {
      sqlMatch = text.match(/SQL:\s*([^\n]+)/i);
      if (sqlMatch) {
        sql = sqlMatch[1].trim();
      }
    }

    // Pattern 4: Just a SQL query in code block
    if (!sql) {
      sqlMatch = text.match(/```sql\s*([\s\S]*?)\s*```/i);
      if (sqlMatch) {
        sql = sqlMatch[1].trim();
      }
    }

    // Clean up SQL
    if (sql) {
      sql = sql
        .replace(/^```sql\n?/i, "")
        .replace(/\n?```$/i, "")
        .replace(/^`|`$/g, "")
        .trim();
    }

    // Extract explanation
    let explanation = "This query will retrieve data from the database.";
    const explanationMatch = text.match(
      /EXPLANATION:\s*([^\n]+(?:\n(?!SQL:)[^\n]+)*)/i
    );
    if (explanationMatch) {
      explanation = explanationMatch[1].trim();
    }

    if (!sql) {
      console.error("Could not extract SQL from response:", text);
      throw new Error("Could not extract SQL from AI response");
    }

    console.log("Extracted SQL:", sql); // Debug log
    console.log("Extracted Explanation:", explanation); // Debug log

    return { sql, explanation };
  } catch (error) {
    console.error("Parse error:", error);
    throw new Error("Failed to parse AI response");
  }
};

/**
 * Fallback: Simple rule-based SQL generation (if AI fails)
 */
export const generateFallbackSQL = (naturalLanguage, tables) => {
  const lowerQuery = naturalLanguage.toLowerCase();

  // Simple pattern matching for common queries
  if (lowerQuery.includes("show all") || lowerQuery.includes("get all")) {
    const tableMatch = tables.find((t) => lowerQuery.includes(t.toLowerCase()));
    if (tableMatch) {
      return {
        sql: `SELECT * FROM ${tableMatch} LIMIT 100;`,
        explanation: `This will retrieve all records from the ${tableMatch} table (limited to 100 rows).`,
      };
    }
  }

  return {
    sql: null,
    explanation:
      "Could not generate SQL query. Please try rephrasing your request.",
  };
};

export default { generateSQLWithAI, generateFallbackSQL };
