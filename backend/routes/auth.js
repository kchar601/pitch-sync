import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /auth/register to handle user registration
router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  try {
    const db = req.app.locals.db; // Get the db from app.locals

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = {
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role, // Can be 'player' or 'coach'
    };

    // Insert new user into the MongoDB database
    const result = await db.collection("users").insertOne(newUser);

    // Generate a JWT token for the newly registered user
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    // Respond with the token
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

export default router;
