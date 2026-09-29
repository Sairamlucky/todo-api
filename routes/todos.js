const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// GET all todos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// POST create todo
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const result = await pool.query(
      "INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *",
      [title, false]
    );

    res.status(201).json({
      message: "Todo created successfully",
      todo: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// PUT update todo
router.put("/:id", async (req, res) => {
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

    res.json({
      message: "Todo updated successfully",
      todo: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// DELETE todo
router.delete("/:id", async (req, res) => {
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
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;