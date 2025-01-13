import React, { useState } from "react";
import Modal from "./Modal";
import {
  FaPlus,
  FaFilter,
  FaEdit,
  FaTrash,
  FaBars,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const dummyTodos = [
  {
    id: 1,
    title: "Project nominating classification",
    description:
      "Description of Project A. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: false,
    dueDate: "2025-01-20",
  },
  {
    id: 2,
    title: "Project intact",
    description: "Description of Project B. Lorem ipsum dolor sit amet.",
    status: true,
    dueDate: "2025-01-22",
  },
];

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  const [todos, setTodos] = useState(dummyTodos);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("date-desc");
  const [isNavOpen, setIsNavOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addTodo = (newTodo) => {
    setTodos([...todos, { id: todos.length + 1, ...newTodo }]);
    closeModal();
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    applyFilter(filterType);
  };
  const handleStatusToggle = (todoId) => {
    const updatedTodos = todos.map((t) =>
      t.id === todoId ? { ...t, status: !t.status } : t
    );
    setTodos(updatedTodos);

    // Update selectedTodo if it matches the toggled todo
    if (selectedTodo?.id === todoId) {
      setSelectedTodo({
        ...selectedTodo,
        status: !selectedTodo.status,
      });
    }
  };

  const applyFilter = (filterType) => {
    const sorted = [...todos].sort((a, b) => {
      if (filterType.includes("date")) {
        return filterType === "date-asc"
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate);
      } else {
        return filterType === "name-asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });
    setTodos(sorted);
  };

  const sortedTodos = todos.sort((a, b) => {
    if (filter.includes("date")) {
      return filter === "date-asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    } else {
      return filter === "name-asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* Side Navigation */}
      {isNavOpen && (
        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } md:block fixed inset-0 w-64 bg-gray-200 dark:bg-gray-800 p-4 z-50`}
        >
          <div className="flex justify-between items-center mb-6">
            {/* Mobile toggle button - hidden on medium and larger screens */}
            <button
              className="p-2 text-gray-100 md:hidden"
              onClick={() => setIsNavOpen(false)}
            >
              <FaBars />
            </button>
            <div className="flex space-x-4">
              <button
                className="p-2 text-gray-100"
                onClick={() => handleFilterChange("date-asc")}
              >
                <FaFilter />
              </button>
            </div>
          </div>
          <ul className="overflow-y-auto space-y-2">
            {sortedTodos.map((todo) => (
              <li
                key={todo.id}
                className={`p-2 rounded-lg cursor-pointer ${
                  selectedTodo?.id === todo.id
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setSelectedTodo(todo)}
              >
                <div className="flex justify-between items-center">
                  <div className="truncate">
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
                  <div className="hidden sm:flex space-x-2">
                    <button onClick={() => setIsModalOpen(true)}>
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTodos(todos.filter((t) => t.id !== todo.id));
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="sm:hidden flex justify-between mt-2">
                  <button className="text-blue-500" onClick={openModal}>
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTodos(todos.filter((t) => t.id !== todo.id));
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Section */}
      <div className="flex-1 p-4 sm:p-8 md:ml-64 lg:ml-64">
        <div className="flex justify-between items-center mb-8">
          <button
            className="p-2 md:hidden lg:hidden"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <FaBars />
          </button>
          <h1 className="text-2xl font-bold">TODO</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2" onClick={openModal}>
              <FaPlus />
            </button>
            <button onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>

        {/* Content */}
        {selectedTodo ? (
          <div className="mt-12 sm:mt-16 px-4">
            <div
              className={`p-8 rounded-lg shadow-lg ${
                darkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{selectedTodo.title}</h2>
                <FaEdit
                  className="text-blue-500 cursor-pointer text-2xl"
                  onClick={openModal}
                />
              </div>
              <div className="flex justify-between text-lg mb-4">
                <div
                  className={`flex items-center px-3 py-2 rounded-full cursor-pointer ${
                    selectedTodo.status ? "bg-green-500" : "bg-gray-400"
                  }`}
                  onClick={() => handleStatusToggle(selectedTodo.id)}
                >
                  <div className="flex items-center justify-center w-5 h-5 mr-2 rounded-full text-sm">
                    {selectedTodo.status ? (
                      <span className="text-white">✔</span>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-gray-600 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-white text-sm md:text-base">
                    {selectedTodo.status ? "Completed" : "Pending"}
                  </span>
                </div>

                <span>Due Date: {selectedTodo.dueDate}</span>
              </div>
              <p className="text-lg leading-relaxed">
                {selectedTodo.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center mt-12">
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
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          onSave={addTodo}
          selectedTodo={selectedTodo}
        />
      )}
    </div>
  );
};

export default Dashboard;
