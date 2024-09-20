import express from "express";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Route to get teams for a specific player based on their userId from JWT
router.get("/teams", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db; // Get the db from app.locals
    const teamsCollection = db.collection("teams");

    // Query to find all teams where the user is in the players list
    const teams = await db
      .collection("teams")
      .find({ players: new ObjectId(req.user.userId) })
      .toArray();
    console.log("Teams found:", teams);

    // If no teams are found, send an empty array or a message
    if (teams.length === 0) {
      return res
        .status(404)
        .json({ message: "No teams found for this player" });
    }

    // Return the found teams
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Error fetching teams" });
  }
});

export default router;
