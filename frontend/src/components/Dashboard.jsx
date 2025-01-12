import React, { useState } from "react";
import Modal from "./Modal";

const dummyTodos = [
  {
    id: 1,
    title: "Project A",
    description: "Description of Project A",
    status: false,
    dueDate: "2025-01-20",
  },
  {
    id: 2,
    title: "Project B",
    description: "Description of Project B",
    status: true,
    dueDate: "2025-01-22",
  },
];

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  const [todos, setTodos] = useState(dummyTodos);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addTodo = (newTodo) => {
    setTodos([...todos, { id: todos.length + 1, ...newTodo }]);
    closeModal();
  };

  return (
    <div className="flex min-h-screen">
      {/* Side Navigation */}
      <div className="w-64 bg-gray-200 dark:bg-gray-800 p-4">
        <div className="flex justify-between items-center mb-6">
          <button className="p-2">☰</button>
          <div className="flex space-x-4">
            <button className="p-2" onClick={openModal}>
              ➕
            </button>
            <button className="p-2">⋮</button>
          </div>
        </div>
        <ul className="overflow-y-auto space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`p-2 rounded-lg cursor-pointer ${
                selectedTodo?.id === todo.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setSelectedTodo(todo)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={todo.status}
                    onChange={() =>
                      setTodos(
                        todos.map((t) =>
                          t.id === todo.id ? { ...t, status: !t.status } : t
                        )
                      )
                    }
                  />
                  <span className="ml-2">{todo.title}</span>
                </div>
                <div className="flex space-x-2">
                  <button>✏️</button>
                  <button
                    onClick={() =>
                      setTodos(todos.filter((t) => t.id !== todo.id))
                    }
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Section */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">TODO</h1>
          <div className="flex items-center space-x-4">
            <span>Username</span>
            <button onClick={toggleDarkMode}>{darkMode ? "🌙" : "☀️"}</button>
          </div>
        </div>

        {/* Content */}
        {selectedTodo ? (
          <div>
            <h2 className="text-xl font-bold">{selectedTodo.title}</h2>
            <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-4">
              <span>
                Status: {selectedTodo.status ? "Completed" : "Not Completed"}
              </span>
              <span>Due Date: {selectedTodo.dueDate}</span>
            </div>
            <p className="mb-4">{selectedTodo.description}</p>
            <button
              className="p-2 bg-blue-600 text-white rounded"
              onClick={openModal}
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Welcome to your TODO App
            </h2>
            <p className="mb-6">Start by adding your first task.</p>
            <button
              className="p-4 bg-blue-600 text-white rounded"
              onClick={openModal}
            >
              Add Task
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && <Modal onClose={closeModal} onSave={addTodo} />}
    </div>
  );
};

export default Dashboard;
