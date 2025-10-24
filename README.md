# NLC - AI-Powered MySQL Database Manager

A full-stack web application that combines MySQL database management with AI-powered natural language query generation. Users can create and manage database tables while leveraging Google Gemini 2.0 Flash AI to convert natural language questions into SQL queries.

## 🚀 Features

### Database Management

- ✅ Create tables with custom columns, data types, and constraints
- ✅ Define primary keys, foreign keys, and relationships
- ✅ View and browse table data with pagination
- ✅ Insert, update, and delete operations
- ✅ Works with any MySQL database (Aiven, db4free, local MySQL)

### AI-Powered Query Generation

- 🤖 Convert natural language to SQL using **Google Gemini 2.0 Flash** (latest free model)
- 📝 Get plain English explanations of generated queries
- ✅ Approve or reject queries before execution
- 🔄 Provide feedback to regenerate queries
- 🔗 Query chaining - ask follow-up questions based on previous results
- ⚡ Fast and accurate SQL generation

### Safety Features

- ⚠️ **Two-Step Verification** - Dangerous operations require double confirmation with escalating warnings
- 🟠 **Progressive Alerts** - Orange warning → Red critical warning before execution
- ⚠️ Dangerous query detection (DELETE, DROP, TRUNCATE, ALTER)
- 🔒 SQL injection prevention
- 🛡️ Query validation middleware
- 📊 Analyst Mode - restricts to SELECT queries only

### Analyst Mode

- 📈 Data analysis focused environment
- 🔍 Only SELECT queries allowed
- 💡 Perfect for exploring data without modification risks
- 🔗 Supports query chaining for iterative analysis

## 🛠️ Tech Stack

**Backend:**

- Node.js + Express.js
- MySQL (mysql2 driver with SSL support)
- Google Gemini 2.0 Flash AI API
- CORS, Body-parser
- ES6 Modules

**Frontend:**

- React 18
- Custom CSS (Tailwind-like utility classes)
- React Icons
- Axios

**Database:**

- MySQL (Aiven, db4free.net, or local MySQL server)
- SSL/TLS connection support for cloud databases

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL database (Aiven, db4free.net, or local MySQL)
- Google Gemini API key (free from https://makersuite.google.com/app/apikey)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/JeelDhamsaniya/Natural-Language-to-MySQL.git
cd Natural-Language-to-MySQL
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the `server` directory:

```env
# Database Configuration (Aiven Example)
DB_HOST=your-mysql-host.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=your_password
DB_NAME=your_database
DB_SSL=true

# For db4free.net or local MySQL:
# DB_HOST=db4free.net (or localhost)
# DB_PORT=3306
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=your_database
# DB_SSL=false

# Server Configuration
PORT=5000

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Environment
NODE_ENV=development
```

**Get your free Gemini API key:**

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env` file

Start the backend server:

```bash
npm start
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm start
```

Start the frontend:

```bash
npm start
```

Frontend will open at `http://localhost:3000`

## 📖 Usage Guide

### Creating Tables

1. Click **"Tables"** in the top navigation
2. Click **"+ Create Table"** in the sidebar
3. Enter table name and define columns:
   - Column name
   - Data type (INT, VARCHAR, TEXT, DATE, etc.)
   - Constraints (Primary Key, Not Null, Unique, Auto Increment)
4. Add foreign keys if needed
5. Click **"Create Table"**

### AI Query Assistant

1. Click **"AI Query"** in the top navigation
2. Type your question in natural language:
   - "Show all users who registered this month"
   - "Get total sales by product category"
   - "Find orders with amount greater than 1000"
3. Click **"Generate SQL"**
4. Review the generated SQL and explanation
5. Click **"Approve & Execute"** or **"Reject & Modify"**
6. View results in the table below

### Analyst Mode

1. Toggle **"Analyst Mode"** in the top right
2. Only SELECT queries will be allowed
3. Perfect for data exploration and analysis
4. Ask follow-up questions based on previous results

### Query Chaining Example

```
Query 1: "Show total sales per month"
Query 2: "Now show only months where sales > 10000"
Query 3: "Show me the top 3 months"
```

The AI remembers context and builds upon previous queries.

## 🏗️ Project Structure

```
NLC/
├── server/
│   ├── config/
│   │   ├── database.js       # MySQL connection
│   │   └── aiService.js      # Gemini AI integration
│   ├── controllers/
│   │   ├── databaseController.js
│   │   └── queryController.js
│   ├── middlewares/
│   │   ├── queryValidator.js  # SQL validation & safety
│   │   └── logger.js
│   ├── routes/
│   │   ├── databaseRoutes.js
│   │   └── queryRoutes.js
│   ├── app.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.js
    │   │   ├── CreateTableModal.js
    │   │   ├── QueryConfirmModal.js
    │   │   └── ResultsTable.js
    │   ├── pages/
    │   │   ├── QueryPage.js
    │   │   └── DatabasePage.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔌 API Endpoints

### Database Management

- `GET /api/database/tables` - Get all tables
- `GET /api/database/schema` - Get complete database schema
- `GET /api/database/tables/:tableName/structure` - Get table structure
- `GET /api/database/tables/:tableName/data` - Get table data (paginated)
- `POST /api/database/tables` - Create new table
- `POST /api/database/tables/data` - Insert data

### Query Operations

- `POST /api/query/generate` - Generate SQL from natural language
- `POST /api/query/execute` - Execute SQL query (with validation)
- `POST /api/query/analyze` - Get query execution plan

## 🎯 Example Use Case

### E-commerce Database

**Tables:**

- `Users` (id, name, email, country, created_at)
- `Products` (id, product_name, category, price)
- `Orders` (id, user_id, product_id, amount, order_date)

**Natural Language Queries:**

1. "Show me all orders placed by users from India in October"
2. "Get total revenue by product category"
3. "Find users who haven't placed any orders"
4. "Show top 5 best-selling products"

The AI will:

1. Analyze your database schema
2. Generate appropriate SQL with JOINs
3. Explain what the query does
4. Wait for your approval
5. Execute and show results

## 🔒 Security Features

- **SQL Injection Prevention**: Only single statements allowed
- **Two-Step Verification**: Dangerous operations (DELETE/DROP/TRUNCATE) require **double confirmation** with escalating warnings
  - **Step 1**: Orange warning modal - Initial safety check
  - **Step 2**: Red critical warning - Final confirmation before execution
- **Query Validation**: Dangerous patterns detected automatically
- **Analyst Mode**: Read-only mode for safe exploration (SELECT queries only)
- **Error Handling**: Graceful error messages and logging
- **Visual Warnings**: Color-coded alerts (orange → red) indicate danger level

See [TWO_STEP_VERIFICATION.md](./TWO_STEP_VERIFICATION.md) for detailed information about the safety system.

## ⚙️ Configuration

### Using Different AI Models

The project uses Google Gemini by default, but you can modify `server/config/aiService.js` to use:

- **Hugging Face**: Change API endpoint and add HF token
- **OpenRouter**: Modify to use OpenRouter API
- **Claude/GPT**: Adapt the API calls accordingly

### Using Local MySQL

In `server/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
```

### Using db4free.net (Free Online MySQL)

1. Go to https://www.db4free.net/signup.php
2. Create free account
3. Use credentials in `.env` file

## 🐛 Troubleshooting

**Database connection fails:**

- Check credentials in `.env`
- Verify database server is running
- For db4free.net, ensure you're using correct host: `db4free.net`

**AI queries not generating:**

- Verify `GEMINI_API_KEY` is set correctly
- Check API key is active at https://makersuite.google.com
- Review server logs for API errors

**Frontend can't connect to backend:**

- Ensure backend is running on port 5000
- Check CORS settings in `server/app.js`
- Verify API URL in `client/src/services/api.js`

## 📝 License

ISC

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 🎉 Acknowledgments

- Google Gemini AI for natural language processing
- MySQL for database management
- React and Express.js communities

---

**Built with ❤️ for developers who want AI-powered database management**
