require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

// Read JSON data from Postman
app.use(express.json());
app.use(express.static("public"));
// PostgreSQL connection

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
pool.connect()
    .then(() => {
        console.log("PostgreSQL database connected successfully");
    })
    .catch((error) => {
        console.log("Database connection failed:");
        console.log(error.message);
    });
// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Todo API is working"
    });
});

// GET all todos
app.get("/todos", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM todos ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error fetching todos",
            error: error.message
        });
    }
});

// POST new todo
app.post("/todos", async (req, res) => {
    try {
        const { title } = req.body;

        const result = await pool.query(
            "INSERT INTO todos (title) VALUES ($1) RETURNING *",
            [title]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.log("POST error:", error.message);

        res.status(500).json({
            message: "Error creating todo",
            error: error.message
        });
    }
});

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const result = await pool.query(
            "UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
            [title, completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.log("PUT error:", error.message);

        res.status(500).json({
            message: "Error updating todo",
            error: error.message
        });
    }
});
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM todos WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json({
            message: "Todo deleted successfully",
            todo: result.rows[0]
        });

    } catch (error) {
        console.log("DELETE error:", error.message);

        res.status(500).json({
            message: "Error deleting todo",
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});