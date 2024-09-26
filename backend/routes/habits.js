import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /habits - Fetch all habits for the authenticated user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const habitsCollection = db.collection("habits");

    // Find habits for the authenticated user
    const habits = await habitsCollection
      .find({ userId: new ObjectId(req.user.userId) })
      .toArray();

    if (habits.length === 0) {
      return res.status(404).json({ message: "No habits found for this user" });
    }

    res.json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({ error: "Error fetching habits" });
  }
});

// POST /habits - Create a new habit
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const habitsCollection = db.collection("habits");
    const { title, frequency } = req.body;

    const newHabit = {
      userId: new ObjectId(req.user.userId),
      title,
      frequency, // e.g., "daily", "weekly"
      streak: 0,
      lastTrackedAt: null,
      createdAt: new Date(),
    };

    await habitsCollection.insertOne(newHabit);

    res.status(201).json({ message: "Habit created successfully." });
  } catch (error) {
    console.error("Error creating habit:", error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

// PUT /habits/:habitId - Update a habit (e.g., track progress)
router.put("/:habitId", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const habitsCollection = db.collection("habits");
    const { habitId } = req.params;
    const { title, frequency, streak, lastTrackedAt } = req.body;

    const updatedHabit = {
      ...(title && { title }),
      ...(frequency && { frequency }),
      ...(streak !== undefined && { streak }),
      ...(lastTrackedAt && { lastTrackedAt: new Date(lastTrackedAt) }),
    };

    const result = await habitsCollection.updateOne(
      { _id: new ObjectId(habitId), userId: new ObjectId(req.user.userId) },
      { $set: updatedHabit }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Habit not found or not owned by user" });
    }

    res.json({ message: "Habit updated successfully" });
  } catch (error) {
    console.error("Error updating habit:", error);
    res.status(500).json({ error: "Error updating habit" });
  }
});

// DELETE /habits/:habitId - Delete a habit
router.delete("/:habitId", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const habitsCollection = db.collection("habits");
    const { habitId } = req.params;

    const result = await habitsCollection.deleteOne({
      _id: new ObjectId(habitId),
      userId: new ObjectId(req.user.userId),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Habit not found or not owned by user" });
    }

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit:", error);
    res.status(500).json({ error: "Error deleting habit" });
  }
});

export default router;
