import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'

import "dotenv/config"; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// app.use(clerkMiddleware())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

// API routes
app.get('/api/hello', requireAuth(), async (req, res) => {
  const { userId, sessionClaims } = getAuth(req);
  if (!userId) {
    return res.status(401).send('Unauthorized');
  }
  return res.json({ userId, sessionClaims });
})

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
