import React from "react";
import { FiDatabase, FiTable } from "react-icons/fi";

const Sidebar = ({ tables, selectedTable, onSelectTable, onCreateTable }) => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <FiDatabase className="text-2xl text-blue-400" />
          <h1 className="text-xl font-bold">NLC DB Manager</h1>
        </div>

        <button
          onClick={onCreateTable}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6 transition duration-200"
        >
          + Create Table
        </button>

        <div className="space-y-1">
          <h3 className="text-gray-400 text-sm font-semibold mb-2 px-2">
            TABLES
          </h3>
          {tables.length === 0 ? (
            <p className="text-gray-500 text-sm px-2">No tables yet</p>
          ) : (
            tables.map((table) => (
              <button
                key={table}
                onClick={() => onSelectTable(table)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition duration-200 ${
                  selectedTable === table
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <FiTable className="text-sm" />
                <span className="truncate">{table}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
