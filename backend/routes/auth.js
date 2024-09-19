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
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }

    // Validate password strength (optional)
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
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

    await db.collection("users").insertOne(newUser);

    // No JWT generated here, just return success message
    res
      .status(201)
      .json({ message: "Registration successful. Please log in." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const db = req.app.locals.db;

  // Check if user exists
  const user = await db.collection("users").findOne({ email });

  // Check if password matches
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await db.collection("refreshTokens").insertOne({ token: refreshToken });

    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.post("/logout", async (req, res) => {
  const db = req.app.locals.db; // Get the db from app.locals
  const { refreshToken } = req.body;
  await db.collection("refreshTokens").deleteOne({ token: refreshToken });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
