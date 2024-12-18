const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Render or fallback to 3000

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb+srv://ravendayawon:Elemeow69!MongoDB@tanay-map.yys6n.mongodb.net/";
const client = new MongoClient(uri);
let db;

client.connect()
    .then(() => {
        console.log("Connected to MongoDB");
        db = client.db("location");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        db = null; // Set db to null to avoid further errors
    });

// Middleware to check MongoDB connection
app.use((req, res, next) => {
    if (!db) {
        return res.status(500).json({ error: "Database not connected" });
    }
    next();
});

// API endpoint to fetch locations
app.get('/api/locations', async (req, res) => {
    const type = req.query.type;
    const allowedTypes = ["church", "school", "store", "supermarket", "hospital", "vet", "police", "fire", "diner", "gas", "worship", "brgyhall", "bank", "vulcanize", "terminal", "inn"];

    if (!type || !allowedTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid type parameter" });
    }

    try {
        const collection = db.collection(type);
        const locations = await collection.find().toArray();
        res.json(locations);
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/api/search', async (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.status(400).json({ error: "Search term is required" });
    }

    try {
        const collections = ["church", "school", "store", "supermarket", "hospital", "vet", "police", "fire", "diner", "gas", "worship", "brgyhall", "bank", "vulcanize", "terminal", "inn"];
        const searchResults = [];

        // Search across all collections
        for (const collectionName of collections) {
            const collection = db.collection(collectionName);
            const results = await collection.find({ 
                name: { $regex: searchTerm, $options: 'i' } // Case-insensitive partial match
            }).toArray();

            // Add results with type for context
            results.forEach(result => {
                searchResults.push({
                    ...result,
                    type: collectionName // Add the collection type for identification
                });
            });
        }

        res.json(searchResults);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Serve the frontend
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
