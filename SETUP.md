# Quick Setup Guide

## Prerequisites

1. Node.js (v14+)
2. MySQL database (Aiven cloud, local, or db4free.net account)
3. Google Gemini API key (free)

## Setup Steps

### 1. Get Database Credentials

**Option A: Use Aiven MySQL (Recommended - Free tier available)**

- Visit https://aiven.io
- Create free account → Create MySQL service
- Note: host, port (usually 24715), username (avnadmin), password, database name (defaultdb)
- SSL is enabled by default

**Option B: Use db4free.net (Free Online)**

- Visit https://www.db4free.net/signup.php
- Create account → note username, password, database name
- Host is always: `db4free.net`
- Port: 3306 (default)

**Option C: Use Local MySQL**

- Install MySQL locally
- Create database: `CREATE DATABASE nlc_db;`
- Note your root credentials
- Port: 3306 (default)

### 2. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### 3. Backend Setup

```bash
cd server
npm install
```

Create `server/.env` file with your credentials:

**For Aiven MySQL (with SSL):**

```env
DB_HOST=mysql-xxxxx-your-project.aivencloud.com
DB_PORT=24715
DB_USER=avnadmin
DB_PASSWORD=your_password
DB_NAME=defaultdb
DB_SSL=true
PORT=5000
GEMINI_API_KEY=your_api_key_here
NODE_ENV=development
```

**For db4free.net or Local MySQL:**

```env
DB_HOST=db4free.net
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_SSL=false
PORT=5000
GEMINI_API_KEY=your_api_key_here
NODE_ENV=development
```

Start server:

```bash
npm start
```

Should see:

```
✅ MySQL Database connected successfully
🚀 Server running on http://localhost:5000
```

### 4. Frontend Setup

```bash
cd client
npm install
```

Start frontend:

```bash
npm start
```

Browser opens at `http://localhost:3000`

## First Use

1. **Create a table:**

   - Click "Tables" → "+ Create Table"
   - Table: `users`
   - Columns: `id` (INT, Primary, Auto Increment), `name` (VARCHAR), `email` (VARCHAR)

2. **Try AI Query:**
   - Click "AI Query"
   - Type: "Show all users"
   - Click "Generate SQL"
   - Review and approve
   - See results!

## Troubleshooting

**Can't connect to database:**

- Check credentials in `server/.env`
- For db4free.net: ensure host is exactly `db4free.net`
- Test connection: run `npm start` and check for ✅ message

**AI not generating queries:**

- Verify GEMINI_API_KEY is correct
- Check API key is active at https://makersuite.google.com
- Look at server console for error messages

**Frontend shows connection error:**

- Ensure backend is running (port 5000)
- Check `client/src/services/api.js` has correct API URL

## Example Database Setup

After creating the app, you can create this example e-commerce schema:

**Users Table:**

```sql
id (INT, Primary, Auto), name (VARCHAR), email (VARCHAR), country (VARCHAR), created_at (TIMESTAMP)
```

**Products Table:**

```sql
id (INT, Primary, Auto), product_name (VARCHAR), category (VARCHAR), price (DECIMAL)
```

**Orders Table:**

```sql
id (INT, Primary, Auto), user_id (INT), product_id (INT), amount (DECIMAL), order_date (DATE)
```

Then try queries like:

- "Show all users from India"
- "Get total sales by category"
- "Find orders over $100"

## Ports Used

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

Make sure these ports are available!
