const todoList = document.getElementById("todoList");
const todoInput = document.getElementById("todoInput");
const message = document.getElementById("message");
const response = await fetch("http://localhost:3000/todos");
const data = await response.json();n

// Show message
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;

    setTimeout(() => {
        message.textContent = "";
        message.className = "";
    }, 2000);
}


// Load all todos
async function loadTodos() {
    try {
        const response = await fetch("http://localhost:3000/todos");

        if (!response.ok) {
            throw new Error("Failed to load todos");
        }

        const todos = await response.json();

        todoList.innerHTML = "";

        todos.forEach(todo => {
            displayTodo(todo);
        });

    } catch (error) {
        console.error(error);
        showMessage("Failed to load todos", "error");
    }
}


// Display todo
function displayTodo(todo) {

    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
        <span class="todo-title ${todo.completed ? "completed" : ""}">
            ${todo.title}
        </span>

        <button class="edit-btn" onclick="editTodo(${todo.id}, '${todo.title}')">
            Edit
        </button>

        <button class="delete-btn" onclick="deleteTodo(${todo.id})">
            Delete
        </button>
    `;

    todoList.appendChild(li);
}


// Add todo
async function addTodo() {

    const title = todoInput.value.trim();

    if (!title) {
        showMessage("Please enter a todo", "error");
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
            showMessage("Failed to add todo", "error");
            return;
        }

        todoInput.value = "";

        showMessage("Todo added successfully!", "success");

        loadTodos();

    } catch (error) {
        console.error(error);
        showMessage("Failed to add todo", "error");
    }
}


// Edit todo
async function editTodo(id, oldTitle) {

    const newTitle = prompt("Enter new todo:", oldTitle);

    if (newTitle === null) {
        return;
    }

    if (!newTitle.trim()) {
        showMessage("Todo title cannot be empty", "error");
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
                    title: newTitle,
                    completed: false
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showMessage("Failed to update todo", "error");
            return;
        }

        showMessage("Todo updated successfully!", "success");

        loadTodos();

    } catch (error) {
        console.error(error);
        showMessage("Failed to update todo", "error");
    }
}


// Delete todo
async function deleteTodo(id) {

    const confirmDelete = confirm(
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
            showMessage("Failed to delete todo", "error");
            return;
        }

        showMessage("Todo deleted successfully!", "success");

        loadTodos();

    } catch (error) {
        console.error(error);
        showMessage("Failed to delete todo", "error");
    }
}


// Load todos when page opens
loadTodos();