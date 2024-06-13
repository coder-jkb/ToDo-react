const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors"); // Import cors
const crypto = require("crypto");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); // Use cors

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // Use your correct password here
  database: "todo_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});

const generateUniqueID = () => { 
    return crypto.randomBytes(8).toString('hex') 
  } 

app.get("/todos", (req, res) => {
  connection.query("SELECT * FROM todos", (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post("/todos", (req, res) => {
  const { text } = req.body;
  connection.query(
    "INSERT INTO todos (id, text, completed) VALUES (?, ?, ?)",
    [generateUniqueID(), text, false],
    (error, results, fields) => {
      if (error) throw error;
      res.send("Todo added successfully");
    }
  );
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  connection.query(
    "UPDATE todos SET completed = ? WHERE id = ?",
    [completed, id],
    (error, results, fields) => {
      if (error) throw error;
      res.send("Todo updated successfully");
    }
  );
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM todos WHERE id = ?",
    [id],
    (error, results, fields) => {
      if (error) throw error;
      res.send("Todo deleted successfully");
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
