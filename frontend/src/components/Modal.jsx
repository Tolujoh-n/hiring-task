import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";

const Modal = ({ onClose, onSave, selectedTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (selectedTodo) {
      setTitle(selectedTodo.title);
      setDescription(selectedTodo.description);
      setStatus(selectedTodo.status);
      setDueDate(selectedTodo.dueDate);
    }
  }, [selectedTodo]);

  const handleSave = () => {
    // Validation for empty fields
    if (title.trim() === "" || description.trim() === "" || !dueDate) {
      toast.error("Please fill out all fields.");
      return;
    }

    const todoData = {
      title,
      description,
      status,
      dueDate,
    };

    // Call the onSave callback passed from the parent with todoData
    onSave(todoData);
    toast.success(
      selectedTodo ? "Todo updated successfully!" : "Todo added successfully!"
    );
    onClose(); // Close the modal after saving
  };

  return (
    <>
      <Toaster />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4 dark:text-white">
            {selectedTodo ? "Edit Todo" : "Add New Todo"}
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                className="p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm dark:text-gray-300">Completed</span>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
