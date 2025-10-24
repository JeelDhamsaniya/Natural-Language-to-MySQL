import React, { useState } from "react";
import { FiDatabase, FiMessageSquare } from "react-icons/fi";
import QueryPage from "./pages/QueryPage";
import DatabasePage from "./pages/DatabasePage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("query"); // 'query' or 'database'

  return (
    <div className="App">
      {/* Top Navigation */}
      <nav className="bg-gray-900 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <FiDatabase className="text-2xl text-blue-400" />
              <span className="text-xl font-bold">NLC Database Manager</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage("query")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                  currentPage === "query"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <FiMessageSquare />
                AI Query
              </button>
              <button
                onClick={() => setCurrentPage("database")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                  currentPage === "database"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <FiDatabase />
                Tables
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {currentPage === "query" ? <QueryPage /> : <DatabasePage />}
      </div>
    </div>
  );
}

export default App;
