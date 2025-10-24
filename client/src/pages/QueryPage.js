import React, { useState, useEffect } from "react";
import {
  FiSend,
  FiLoader,
  FiToggleLeft,
  FiToggleRight,
  FiRefreshCw,
} from "react-icons/fi";
import { queryAPI } from "../services/api";
import QueryConfirmModal from "../components/QueryConfirmModal";
import ResultsTable from "../components/ResultsTable";

const QueryPage = () => {
  const [naturalQuery, setNaturalQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [analystMode, setAnalystMode] = useState(false);

  // Query state
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isDangerous, setIsDangerous] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationLevel, setConfirmationLevel] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");

  // Results
  const [results, setResults] = useState(null);
  const [executionTime, setExecutionTime] = useState("");
  const [error, setError] = useState("");

  // Query history for chaining
  const [queryHistory, setQueryHistory] = useState([]);
  const [previousQuery, setPreviousQuery] = useState(null);

  const handleGenerateQuery = async (feedback = null) => {
    if (!naturalQuery.trim()) return;

    setLoading(true);
    setError("");
    setConfirmationLevel(0); // Reset confirmation level

    try {
      const response = await queryAPI.generateQuery(
        naturalQuery,
        previousQuery,
        feedback
      );

      if (response.data.success) {
        const { sql, explanation } = response.data.data;
        setGeneratedSQL(sql);
        setExplanation(explanation);
        setNeedsConfirmation(true);
        setIsDangerous(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate query");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteQuery = async () => {
    setExecuting(true);
    setError("");

    try {
      const response = await queryAPI.executeQuery(
        generatedSQL,
        analystMode,
        confirmationLevel
      );

      // Check if needs confirmation (first or second)
      if (response.data.needsConfirmation) {
        const newLevel = response.data.confirmationLevel || 1;
        setIsDangerous(true);
        setNeedsConfirmation(true);
        setConfirmationLevel(newLevel);
        setWarningMessage(response.data.warning);
        setExecuting(false);
        return;
      }

      if (response.data.success) {
        setResults(response.data.data);
        setExecutionTime(response.data.executionTime);
        setNeedsConfirmation(false);
        setConfirmationLevel(0); // Reset confirmation level

        // Add to history for query chaining
        setQueryHistory([
          ...queryHistory,
          {
            query: naturalQuery,
            sql: generatedSQL,
            timestamp: new Date(),
          },
        ]);
        setPreviousQuery(generatedSQL);

        // Clear input for next query
        setNaturalQuery("");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to execute query");
      setNeedsConfirmation(false);
      setConfirmationLevel(0);
    } finally {
      setExecuting(false);
    }
  };

  const handleReject = () => {
    setNeedsConfirmation(false);
    setConfirmationLevel(0); // Reset confirmation level
    setIsDangerous(false);
    // Focus back on input for user to modify
  };

  const handleRegenerateWithFeedback = (feedback) => {
    handleGenerateQuery(feedback);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                AI Query Assistant
              </h1>
              <p className="text-gray-600">
                Ask questions in natural language and get SQL queries
              </p>
            </div>

            {/* Analyst Mode Toggle */}
            <button
              onClick={() => setAnalystMode(!analystMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition duration-200 ${
                analystMode
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {analystMode ? (
                <>
                  <FiToggleRight className="text-xl" />
                  Analyst Mode ON
                </>
              ) : (
                <>
                  <FiToggleLeft className="text-xl" />
                  Analyst Mode OFF
                </>
              )}
            </button>
          </div>

          {analystMode && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-800 text-sm">
                📊 <strong>Analyst Mode:</strong> Only SELECT queries allowed.
                Perfect for data analysis and exploration.
              </p>
            </div>
          )}
        </div>

        {/* Query Input */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your question
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGenerateQuery()}
              placeholder="e.g., Show all users who registered this month"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={() => handleGenerateQuery()}
              disabled={loading || !naturalQuery.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition duration-200"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiSend />
                  Generate SQL
                </>
              )}
            </button>
          </div>

          {/* Query History for Context */}
          {queryHistory.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  💡 You can ask follow-up questions based on previous queries
                </p>
                <button
                  onClick={() => {
                    setQueryHistory([]);
                    setPreviousQuery(null);
                    setResults(null);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <FiRefreshCw className="text-xs" />
                  Clear History
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Last query: {queryHistory[queryHistory.length - 1].query}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
          <ResultsTable
            results={results}
            executionTime={executionTime}
            error={error}
          />
        </div>
      </div>

      {/* Query Confirmation Modal */}
      <QueryConfirmModal
        isOpen={needsConfirmation}
        onClose={() => setNeedsConfirmation(false)}
        sql={generatedSQL}
        explanation={explanation}
        isDangerous={isDangerous}
        confirmationLevel={confirmationLevel}
        warningMessage={warningMessage}
        onApprove={handleExecuteQuery}
        onReject={handleReject}
        loading={executing}
      />
    </div>
  );
};

export default QueryPage;
