const express = require("express");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
console.log("MONGO_URI:", mongoUri);
const client = new MongoClient(mongoUri);

const dbName = "passmanager";

async function startServer() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // GET all users
        app.get("/", async (req, res) => {
            try {
                const db = client.db(dbName);
                const collection = db.collection("users");

                const users = await collection.find({}).toArray();
                res.json(users);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // SAVE a user
        app.post("/save", async (req, res) => {
            console.log("========== POST HIT ==========");
            console.log(req.body);

            try {
                const db = client.db(dbName);
                const collection = db.collection("users");

                const result = await collection.insertOne(req.body);

                console.log("Inserted:", result.insertedId);

                res.json({
                    success: true,
                    insertedId: result.insertedId,
                });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        });

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
}

startServer();