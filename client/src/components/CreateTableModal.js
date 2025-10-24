import React, { useState } from "react";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";

const CreateTableModal = ({ isOpen, onClose, onSubmit }) => {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([
    {
      name: "id",
      type: "INT",
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
  ]);
  const [foreignKeys, setForeignKeys] = useState([]);

  const dataTypes = [
    "INT",
    "BIGINT",
    "VARCHAR(255)",
    "TEXT",
    "DATE",
    "DATETIME",
    "TIMESTAMP",
    "BOOLEAN",
    "DECIMAL(10,2)",
    "FLOAT",
    "DOUBLE",
  ];

  const addColumn = () => {
    setColumns([
      ...columns,
      { name: "", type: "VARCHAR(255)", notNull: false },
    ]);
  };

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index, field, value) => {
    const updated = [...columns];
    updated[index][field] = value;
    setColumns(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ tableName, columns, foreignKeys });
    resetForm();
  };

  const resetForm = () => {
    setTableName("");
    setColumns([
      {
        name: "id",
        type: "INT",
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
    ]);
    setForeignKeys([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create New Table</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Name
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., users, products"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Columns
              </label>
              <button
                type="button"
                onClick={addColumn}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <FiPlus /> Add Column
              </button>
            </div>

            <div className="space-y-3">
              {columns.map((column, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) =>
                        updateColumn(index, "name", e.target.value)
                      }
                      placeholder="Column name"
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <select
                      value={column.type}
                      onChange={(e) =>
                        updateColumn(index, "type", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {dataTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <div className="col-span-2 flex flex-wrap gap-3">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={column.primaryKey || false}
                          onChange={(e) =>
                            updateColumn(index, "primaryKey", e.target.checked)
                          }
                          className="rounded text-blue-600"
                        />
                        Primary Key
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={column.autoIncrement || false}
                          onChange={(e) =>
                            updateColumn(
                              index,
                              "autoIncrement",
                              e.target.checked
                            )
                          }
                          className="rounded text-blue-600"
                        />
                        Auto Increment
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={column.notNull || false}
                          onChange={(e) =>
                            updateColumn(index, "notNull", e.target.checked)
                          }
                          className="rounded text-blue-600"
                        />
                        Not Null
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={column.unique || false}
                          onChange={(e) =>
                            updateColumn(index, "unique", e.target.checked)
                          }
                          className="rounded text-blue-600"
                        />
                        Unique
                      </label>
                    </div>
                  </div>

                  {columns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColumn(index)}
                      className="text-red-600 hover:text-red-700 mt-2"
                    >
                      <FiMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTableModal;
