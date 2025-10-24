import React from "react";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const ResultsTable = ({ results, executionTime, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-red-600 text-xl flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-red-800 font-semibold mb-2">Query Error</h3>
            <p className="text-red-700 font-mono text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>No results yet. Execute a query to see data.</p>
      </div>
    );
  }

  // Handle non-SELECT queries (INSERT, UPDATE, DELETE, etc.)
  if (!Array.isArray(results) || results.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <FiCheckCircle className="text-green-600 text-xl" />
          <div>
            <h3 className="text-green-800 font-semibold">
              Query executed successfully
            </h3>
            <p className="text-green-700 text-sm mt-1">
              {results.affectedRows
                ? `${results.affectedRows} row(s) affected`
                : "Operation completed"}
            </p>
            {executionTime && (
              <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                <FiClock className="text-xs" />
                Execution time: {executionTime}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const columns = Object.keys(results[0]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 text-sm">
          {results.length} row{results.length !== 1 ? "s" : ""} returned
        </p>
        {executionTime && (
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <FiClock className="text-xs" />
            {executionTime}
          </p>
        )}
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row[column] === null ? (
                      <span className="text-gray-400 italic">NULL</span>
                    ) : (
                      String(row[column])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
