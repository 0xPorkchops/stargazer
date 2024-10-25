import express from "express";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
} from "@clerk/clerk-sdk-node";
import "dotenv/config"; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// Connect to MongoDB
/*
const mongoUri = process.env.MONGO_URI || 'your-mongodb-uri';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
*/
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

// API routes
app.get("/api/hello", ClerkExpressRequireAuth(), (req, res) => {
  res.send({ message: "Hello from Express! You are logged in :)" });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "client", "build", "index.html")
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
