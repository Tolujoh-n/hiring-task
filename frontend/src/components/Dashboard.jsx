import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import axios from "axios";

const Dashboard = ({ darkMode, toggleDarkMode, onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("date-desc");
  const [isNavOpen, setIsNavOpen] = useState(true);

  // Fetch user info if missing
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/v1/auth/user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUserId(userData.id);
      setUsername(userData.username);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("username", userData.username);
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.response?.status === 401) {
        onLogout();
      }
    }
  };

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/v1/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setTodos(response.data);
      } else {
        console.error("Unexpected API response:", response.data);
        setTodos([]); // Set to empty array if the response isn't an array
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      if (error.response?.status === 401) {
        onLogout();
      }
    }
  };

  const handleStatusToggle = async (todoId) => {
    try {
      const todoToUpdate = todos.find((t) => t.id === todoId);
      const updatedStatus = !todoToUpdate.status;

      const response = await axios.put(
        `/api/v1/todos/${todoId}`,
        { ...todoToUpdate, status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodos(
        todos.map((t) =>
          t.id === todoId ? { ...t, status: response.data.status } : t
        )
      );
      toast.success("Todo status updated successfully");
    } catch (error) {
      console.error("Error updating todo status:", error);
      toast.error("Failed to update status");
    }
  };

  // Load data on mount
  useEffect(() => {
    if (!userId || !username) {
      fetchUserInfo();
    }
    fetchTodos();
  }, [userId]);

  // Add a todo
  const handleAddTodo = async (newTodo) => {
    try {
      const response = await axios.post(
        "/api/v1/todos",
        { ...newTodo, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos([...todos, response.data]);
      toast.success("Todo added successfully");
      closeModal();
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo");
    }
  };

  // Update a todo
  const handleUpdateTodo = async (updatedTodo) => {
    try {
      const response = await axios.put(
        `/api/v1/todos/${updatedTodo.id}`,
        { ...updatedTodo, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(
        todos.map((todo) => (todo.id === updatedTodo.id ? response.data : todo))
      );
      toast.success("Todo updated successfully");
      closeModal();
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo");
    }
  };

  // Delete a todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
    }
  };

  // Filter and sorting logic
  const applyFilter = (filterType) => {
    if (!Array.isArray(todos)) {
      console.error("Cannot sort todos: not an array", todos);
      return;
    }

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

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    applyFilter(filterType);
  };

  const openModalForAdd = () => {
    setSelectedTodo(null); // Reset the selected todo
    setIsModalOpen(true);
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo); // Prefill modal with todo details
    setIsModalOpen(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const sortedTodos = Array.isArray(todos)
    ? todos.sort((a, b) => {
        if (filter.includes("date")) {
          return filter === "date-asc"
            ? new Date(a.dueDate) - new Date(b.dueDate)
            : new Date(b.dueDate) - new Date(a.dueDate);
        } else {
          return filter === "name-asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      })
    : [];

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
              className="p-2 md:hidden"
              onClick={() => setIsNavOpen(false)}
            >
              <FaBars />
            </button>
            <div className="flex space-x-4">
              <button
                className="p-2"
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
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setSelectedTodo(todo)}
              >
                <div className="flex justify-between items-center">
                  <div className="truncate">
                    <input
                      type="checkbox"
                      checked={todo.status}
                      onChange={() => handleStatusToggle(todo.id)}
                    />
                    <span className="ml-2">{todo.title}</span>
                  </div>
                  <div className="hidden sm:flex space-x-2">
                    <button
                      className="text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(todo);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(todo.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="sm:hidden flex justify-between mt-2">
                  <button
                    className="text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(todo);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(todo.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="absolute bottom-0 inset-x-0 bg-red-500 text-white p-2 m-4 rounded-lg w-auto text-center hover:bg-red-600 transition-all duration-300"
            onClick={onLogout}
          >
            Logout
          </button>
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
            <button className="p-2" onClick={openModalForAdd}>
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
            <div className="p-8 rounded-lg shadow-lg bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">{selectedTodo.title}</h2>
                <FaEdit
                  className="text-blue-500 cursor-pointer text-2xl transition-transform duration-300 hover:scale-110"
                  onClick={openModal}
                />
              </div>

              <div className="flex justify-between text-lg mb-4">
                <div
                  className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-colors duration-300 ${
                    selectedTodo.status ? "bg-green-500" : "bg-gray-400"
                  }`}
                  onClick={() => handleStatusToggle(selectedTodo.id)}
                >
                  <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-full text-sm">
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

                <span className="text-sm md:text-base font-medium">
                  Due Date: {selectedTodo.dueDate}
                </span>
              </div>

              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
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
              onClick={openModalForAdd}
            >
              Add Task
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={selectedTodo ? handleUpdateTodo : handleAddTodo}
          todo={selectedTodo}
        />
      )}
    </div>
  );
};

export default Dashboard;
