import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // GET - Read all todos
  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos");
      const data = await response.json();

      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // POST - Create todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a todo");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add todo");
        return;
      }

      setTitle("");
      getTodos();

    } catch (error) {
      console.log(error);
    }
  };

  // PUT - Update todo
  const updateTodo = async (id) => {
    if (!editingTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: editingTitle,
            completed: false
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update todo");
        return;
      }

      setEditingId(null);
      setEditingTitle("");
      getTodos();

    } catch (error) {
      console.log(error);
    }
  };

  // DELETE - Delete todo
  const deleteTodo = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/todos/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete todo");
        return;
      }

      getTodos();

    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

 return (
  <div className="dashboard">
    <div className="dashboard-container">

      <div className="dashboard-header">
        <div>
          <h1>Todo Dashboard</h1>
          {user && <p>Welcome, {user.name} 👋</p>}
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="add-todo-card">
        <h2>Add Todo</h2>

        <form onSubmit={addTodo} className="add-form">
          <input
            type="text"
            placeholder="Enter a new todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit" className="add-btn">
            Add Todo
          </button>
        </form>
      </div>

      <div className="todo-card">
        <h2>My Todos</h2>

        {todos.length === 0 ? (
          <p className="empty-message">No todos found</p>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <div className="todo-item" key={todo.id}>

                {editingId === todo.id ? (
                  <div className="edit-section">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) =>
                        setEditingTitle(e.target.value)
                      }
                    />

                    <button
                      className="save-btn"
                      onClick={() => updateTodo(todo.id)}
                    >
                      Save
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setEditingId(null);
                        setEditingTitle("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="todo-info">
                      <span className="todo-title">
                        {todo.title}
                      </span>

                      <span
                        className={
                          todo.completed
                            ? "status completed"
                            : "status pending"
                        }
                      >
                        {todo.completed
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </div>

                    <div className="todo-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditingTitle(todo.title);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  </div>
);
}
export default Dashboard;