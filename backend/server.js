import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import authRoutes from "./routes/auth.js";

dotenv.config({ path: "./backend/.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

// MongoDB connection string using environment variables
const uri =
  "mongodb+srv://kchar:" +
  process.env.MONGODB_PASSWORD +
  "@pitchsync.s1p42.mongodb.net/?retryWrites=true&w=majority&appName=PitchSync";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db; // Variable to store the database instance

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    db = client.db(process.env.MONGODB_DBNAME);
    app.locals.db = db; // Store the db in app.locals for global access
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the MongoDB connection function
connectToMongo();

// Routes
app.use("/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// for concurrent server starts, do not remove
app.get("/status", (req, res) => {
  res.status(200).send("Server is up and running!");
});
