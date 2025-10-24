import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { databaseAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import CreateTableModal from "../components/CreateTableModal";
import ResultsTable from "../components/ResultsTable";

const DatabasePage = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable);
    }
  }, [selectedTable]);

  const loadTables = async () => {
    try {
      const response = await databaseAPI.getTables();
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (err) {
      console.error("Failed to load tables:", err);
    }
  };

  const loadTableData = async (tableName) => {
    setLoading(true);
    setError("");
    try {
      const response = await databaseAPI.getTableData(tableName);
      if (response.data.success) {
        setTableData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load table data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (data) => {
    try {
      const response = await databaseAPI.createTable(data);
      if (response.data.success) {
        setShowCreateModal(false);
        loadTables();
        alert("Table created successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create table");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        tables={tables}
        selectedTable={selectedTable}
        onSelectTable={setSelectedTable}
        onCreateTable={() => setShowCreateModal(true)}
      />

      <div className="ml-64 flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedTable
                    ? `Table: ${selectedTable}`
                    : "Database Manager"}
                </h1>
                <p className="text-gray-600">
                  {selectedTable
                    ? "View and manage table data"
                    : "Select a table from the sidebar or create a new one"}
                </p>
              </div>

              {selectedTable && (
                <button
                  onClick={() => loadTableData(selectedTable)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                >
                  <FiRefreshCw className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {loading ? (
              <div className="text-center py-12">
                <FiRefreshCw className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading table data...</p>
              </div>
            ) : selectedTable && tableData ? (
              <ResultsTable results={tableData} error={error} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Select a table to view its contents</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateTableModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTable}
      />
    </div>
  );
};

export default DatabasePage;
