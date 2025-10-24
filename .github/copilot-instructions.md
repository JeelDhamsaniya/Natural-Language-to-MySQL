# Copilot Instructions for NLC AI-Powered MySQL Database Manager

## Project Overview

Full-stack AI-powered database management application. Users create/manage MySQL tables and use natural language to generate SQL queries via Google Gemini 2.0 Flash API (gemini-2.0-flash-exp). Features query approval workflow, dangerous query detection, and analyst mode for read-only operations.

## Architecture & Data Flow

**Backend (Express.js):**

- `config/database.js` - MySQL connection pool (mysql2/promise) with SSL support for cloud databases
- `config/aiService.js` - Gemini 2.0 Flash API integration for NL→SQL conversion
- `middlewares/queryValidator.js` - SQL safety checks (dangerous patterns, analyst mode restrictions)
- Controllers handle: table creation, query generation, query execution

**Frontend (React):**

- `pages/QueryPage.js` - Main AI query interface with confirmation modal
- `pages/DatabasePage.js` - Table browser with sidebar navigation
- `services/api.js` - Axios client for all backend communication
- State-driven confirmation workflow before query execution

**Key Flow:**

1. User enters natural language → POST `/api/query/generate`
2. Backend calls Gemini API with schema context → returns SQL + explanation
3. Frontend shows confirmation modal → user approves/rejects
4. If approved → POST `/api/query/execute` (with `confirmed: true` if dangerous)
5. Middleware validates safety → executes → returns results

## Critical Patterns

### Query Safety Layer

All queries pass through `queryValidator.js`:

- **Dangerous patterns**: `/\bDROP\s+TABLE\b/i`, `/\bDELETE\s+FROM\b/i`, etc.
- If dangerous + not confirmed → return `needsConfirmation: true` (status 200, not error)
- Analyst mode: only `/^\s*SELECT\b/i` allowed (403 if violated)
- Single statement enforcement via `sanitizeQuery()`

### AI Prompt Engineering

`aiService.js` builds prompts with:

- Full database schema (tables + columns from `DESCRIBE`)
- Previous query context for chaining
- User feedback if query rejected
- Structured response format: `SQL: <query>\nEXPLANATION: <text>`

Parse response with regex: ` text.match(/SQL:\s*```sql\n([\s\S]*?)\n```/i) `

### Query Confirmation Workflow

`QueryPage.js` state machine:

```javascript
needsConfirmation: false → Generate → true → Modal opens
isDangerous: false/true → Changes modal UI (red vs blue)
onApprove → executeQuery(confirmed: true) → needsConfirmation: false
onReject → needsConfirmation: false → User modifies input
```

Never execute without showing modal first. Backend enforces this.

## Database Schema Discovery

Tables created with `CREATE TABLE` from user input (dynamic schema).
Schema context for AI generated on-the-fly:

```javascript
for (const table of tables) {
  const [columns] = await pool.query(`DESCRIBE ${table}`);
  schemaContext += `${table}:\n  - ${columns
    .map((c) => c.Field + " " + c.Type)
    .join("\n  - ")}`;
}
```

Foreign keys queried from `INFORMATION_SCHEMA.KEY_COLUMN_USAGE`.

## Common Development Tasks

**Add new AI provider:**
Modify `config/aiService.js` → change `GEMINI_API_URL` and request format. Keep response parsing compatible or update regex.

**Add new dangerous pattern:**
Add to `middlewares/queryValidator.js` → `DANGEROUS_PATTERNS` array.

**Customize table creation:**
Edit `controllers/databaseController.js` → `createTable()` → modify SQL generation logic for constraints.

**Change query result limit:**
`databaseController.js` → `getTableData()` → default `limit = 50` parameter.

## Running & Testing

**Start backend:**

```bash
cd server
npm install
# Create .env with DB credentials + GEMINI_API_KEY
npm start  # Port 5000
```

**Start frontend:**

```bash
cd client
npm install
npm start  # Port 3000
```

**Test query flow:**

1. Create table via UI → POST `/api/database/tables`
2. Use AI Query page → Enter "Show all rows from <table>"
3. Verify modal appears with SQL + explanation
4. Approve → Check results display

**Test analyst mode:**
Toggle analyst mode → Try "DELETE FROM users" → Should get 403 error (not confirmation modal).

## Environment Variables

Required in `server/.env`:

```
DB_HOST=db4free.net
DB_PORT=3306
DB_USER=<username>
DB_PASSWORD=<password>
DB_NAME=<database>
DB_SSL=false
GEMINI_API_KEY=<get from makersuite.google.com>
PORT=5000
```

For Aiven MySQL (with SSL):

```
DB_HOST=mysql-xxxxx-your-project.aivencloud.com
DB_PORT=24715
DB_USER=avnadmin
DB_PASSWORD=<password>
DB_NAME=defaultdb
DB_SSL=true
GEMINI_API_KEY=<get from makersuite.google.com>
PORT=5000
```

Frontend assumes backend at `http://localhost:5000` (hardcoded in `api.js`).

## Known Limitations

- Single database per instance (configured via .env)
- Query history stored in frontend state (lost on refresh)
- No user authentication (single-user mode)
- Gemini API free tier rate limits apply
- db4free.net has connection limits (consider local MySQL for heavy use)

## Key Files for AI Agents

- `server/config/aiService.js` - Modify for different LLM providers
- `server/middlewares/queryValidator.js` - Add safety rules here
- `client/src/pages/QueryPage.js` - Main user interaction logic
- `server/controllers/queryController.js` - Core query execution logic
