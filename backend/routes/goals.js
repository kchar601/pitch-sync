import express from "express";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /goals - Fetch all goals for the authenticated user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db; // Get the db from app.locals
    const goalsCollection = db.collection("goals");

    // Query to find all goals for the authenticated user
    const goals = await goalsCollection
      .find({ userId: new ObjectId(req.user.userId) })
      .toArray();

    // If no goals are found, send an empty array or a message
    if (goals.length === 0) {
      return res.status(404).json({ message: "No goals found for this user" });
    }

    // Return the found goals
    res.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ error: "Error fetching goals" });
  }
});

// POST /goals - Create a new goal
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db; // Get the db from app.locals
    const goalsCollection = db.collection("goals");
    const { title, description, dueDate, milestones } = req.body;

    // Create new goal object
    const newGoal = {
      userId: new ObjectId(req.user.userId), // Associate the goal with the authenticated user
      title,
      description,
      dueDate: new Date(dueDate),
      milestones: milestones || [],
      progress: 0, // Set progress to 0 when creating a new goal
      createdAt: new Date(),
    };

    await goalsCollection.insertOne(newGoal);

    res.status(201).json({ message: "Goal created successfully." });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

// PUT /goals/:goalId - Update an existing goal (e.g., progress, milestones)
router.put("/:goalId", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const goalsCollection = db.collection("goals");
    const { goalId } = req.params;
    const { title, description, dueDate, milestones, progress } = req.body;

    // Update the goal
    const updatedGoal = {
      ...(title && { title }),
      ...(description && { description }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(milestones && { milestones }),
      ...(progress !== undefined && { progress }), // Update only if progress is provided
    };

    const result = await goalsCollection.updateOne(
      { _id: new ObjectId(goalId), userId: new ObjectId(req.user.userId) },
      { $set: updatedGoal }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Goal not found or not owned by user" });
    }

    res.json({ message: "Goal updated successfully" });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ error: "Error updating goal" });
  }
});

// DELETE /goals/:goalId - Delete a goal
router.delete("/:goalId", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const goalsCollection = db.collection("goals");
    const { goalId } = req.params;

    const result = await goalsCollection.deleteOne({
      _id: new ObjectId(goalId),
      userId: new ObjectId(req.user.userId),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Goal not found or not owned by user" });
    }

    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Error deleting goal" });
  }
});

export default router;
