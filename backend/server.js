import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "./backend/.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection string using environment variables
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?${process.env.MONGODB_OPTIONS}`;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// MongoDB client setup
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
    db = client.db(process.env.MONGODB_DBNAME); // Use the database name from .env
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the MongoDB connection function
connectToMongo();

// Example route to create a new team
app.post("/teams", async (req, res) => {
  const { name, players } = req.body;

  try {
    const teamsCollection = db.collection("teams"); // Select the 'teams' collection
    const result = await teamsCollection.insertOne({ name, players });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating team" });
  }
});

// Example route to get all teams
app.get("/teams", async (req, res) => {
  try {
    const teamsCollection = db.collection("teams");
    const teams = await teamsCollection.find().toArray();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: "Error fetching teams" });
  }
});

// for concurrent server starts
app.get("/status", (req, res) => {
  res.status(200).send("Server is up and running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
