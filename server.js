const express = require("express");
const neo4j = require("neo4j-driver");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to your DB
const driver = neo4j.driver(
  "neo4j+s://aaf76fe4.databases.neo4j.io",
  neo4j.auth.basic("aaf76fe4", "BYTdYxxXXvd0UlDor6BM8uneGB6N-cKDv4X84CX6R5g")
);

// API to add task
app.post("/add-task", async (req, res) => {
  const session = driver.session();
  const { title } = req.body;

  try {
    await session.run(
      "CREATE (t:Task {title: $title})",
      { title }
    );
    res.send("Task added");
  } catch (err) {
    res.status(500).send(err);
  } finally {
    await session.close();
  }
});

// API to get tasks
app.get("/tasks", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run("MATCH (t:Task) RETURN t");
    const tasks = result.records.map(r => r.get("t").properties);
    res.json(tasks);
  } finally {
    await session.close();
  }
});

app.listen(5000, () => console.log("Server running"));