import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /tasks - Fetch all tasks for the authenticated user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const tasksCollection = db.collection("tasks");

    // Find tasks for the authenticated user
    const tasks = await tasksCollection
      .find({ userId: new ObjectId(req.user.userId) })
      .toArray();

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// POST /tasks - Create a new task
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const tasksCollection = db.collection("tasks");
    const { title, description, dueDate, priority } = req.body;

    const newTask = {
      userId: new ObjectId(req.user.userId),
      title,
      description,
      dueDate: new Date(dueDate),
      priority, // e.g., "low", "medium", "high"
      status: "pending", // Default status
      createdAt: new Date(),
    };

    await tasksCollection.insertOne(newTask);

    res.status(201).json({ message: "Task created successfully." });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

// PUT /tasks/:taskId - Update a task (e.g., mark as completed)
router.put("/:taskId", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const tasksCollection = db.collection("tasks");
    const { taskId } = req.params;
    const { title, description, dueDate, priority, status } = req.body;

    const updatedTask = {
      ...(title && { title }),
      ...(description && { description }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(priority && { priority }),
      ...(status && { status }), // e.g., "completed"
    };

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(taskId), userId: new ObjectId(req.user.userId) },
      { $set: updatedTask }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or not owned by user" });
    }

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task" });
  }
});

// DELETE /tasks/:taskId - Delete a task
router.delete("/:taskId", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const tasksCollection = db.collection("tasks");
    const { taskId } = req.params;

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(req.user.userId),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or not owned by user" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task" });
  }
});

export default router;
