import React from "react";
import { FiX, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const QueryConfirmModal = ({
  isOpen,
  onClose,
  sql,
  explanation,
  isDangerous,
  confirmationLevel = 0,
  warningMessage,
  onApprove,
  onReject,
  loading,
}) => {
  if (!isOpen) return null;

  // Determine modal styling based on confirmation level
  const getModalStyle = () => {
    if (!isDangerous) return "blue";
    if (confirmationLevel === 1) return "orange";
    if (confirmationLevel === 2) return "red";
    return "blue";
  };

  const modalStyle = getModalStyle();

  const colorClasses = {
    blue: {
      icon: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    orange: {
      icon: "text-orange-600",
      bg: "bg-orange-50 border-orange-200",
      text: "text-orange-800",
      button: "bg-orange-600 hover:bg-orange-700",
    },
    red: {
      icon: "text-red-600",
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      button: "bg-red-600 hover:bg-red-700",
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            {isDangerous ? (
              <>
                <FiAlertTriangle
                  className={`text-2xl ${colorClasses[modalStyle].icon}`}
                />
                <h2 className="text-2xl font-bold text-gray-800">
                  {confirmationLevel === 2
                    ? "🚨 FINAL WARNING"
                    : "⚠️ Confirm Dangerous Query"}
                </h2>
              </>
            ) : (
              <>
                <FiCheckCircle className="text-2xl text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Confirm Query
                </h2>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          {isDangerous && (
            <div
              className={`mb-4 p-4 border rounded-lg ${colorClasses[modalStyle].bg}`}
            >
              <p className={`font-medium ${colorClasses[modalStyle].text}`}>
                {warningMessage ||
                  "⚠️ This query will modify or delete data permanently."}
              </p>
              {confirmationLevel === 2 && (
                <p
                  className={`mt-2 font-bold ${colorClasses[modalStyle].text}`}
                >
                  This is your LAST CHANCE to cancel. This operation CANNOT be
                  undone!
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              What this query will do:
            </h3>
            <p className="text-gray-800 bg-blue-50 p-3 rounded-lg">
              {explanation}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              SQL Query:
            </h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {sql}
            </pre>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onReject}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-50"
            >
              {confirmationLevel === 2 ? "Cancel" : "Reject & Modify"}
            </button>
            <button
              onClick={onApprove}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white transition duration-200 disabled:opacity-50 ${colorClasses[modalStyle].button}`}
            >
              {loading
                ? "Executing..."
                : confirmationLevel === 2
                ? "I Understand - Execute Now"
                : isDangerous
                ? "Continue"
                : "Approve & Execute"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryConfirmModal;
