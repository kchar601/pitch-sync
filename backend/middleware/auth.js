import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

// POST /auth/register to handle user registration
router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

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
      emailVerified: false,
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

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check if password matches
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  console.log(password, user.passwordHash, passwordMatch);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate new access and refresh tokens
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // Store refresh token in the database
  await db
    .collection("refreshTokens")
    .insertOne({ token: refreshToken, userId: user._id });

  res.json({ accessToken, refreshToken });
});

router.post("/logout", async (req, res) => {
  const db = req.app.locals.db;
  const { refreshToken } = req.body;

  // Check if refresh token exists
  const tokenExists = await db
    .collection("refreshTokens")
    .findOne({ token: refreshToken });

  if (!tokenExists) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }

  await db.collection("refreshTokens").deleteOne({ token: refreshToken });
  res.status(200).json({ message: "Logged out successfully" });
});

export function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

export default router;
