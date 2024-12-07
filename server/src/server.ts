import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express';
import { randomEvent } from './utils/getEvent.js';
import "dotenv/config"; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import cors from "cors";

import { Collection } from 'mongodb';
import { dbConnection } from './data_access_module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true,  // Allow credentials if needed for cookies/sessions
}));

// Connect to MongoDB
/*
const mongoUri = process.env.MONGO_URI || 'your-mongodb-uri';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
*/

interface User{
  clerkUserId: string;
  _id : string;
  _firstname: string;
  _lastname: string;
  _username: string;
  _email: string;
  settings?: UserSettings;
}

interface UserSettings {
  name: string;
  latitude: number;
  longitude: number;
  theme: 'dark' | 'light' | 'red';
  notifyEmail: boolean;
  notifyPhone: boolean;
  email: string;
  phone: string;
  phoneProvider: string;
  lastUpdated: Date;
}

async function startServer() {
  try {
    await dbConnection.connect();

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

    app.get('/api/id', requireAuth({ signInUrl: '/sign-in' }), async (req, res) => {
      const { userId } = getAuth(req);
      res.send({ message: userId});
    });

    // API routes
    app.route('/api/user')
    .get(requireAuth(), async (req, res) => {

      const { userId } = getAuth(req);
      if (!userId){
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      try {
        console.log(userId);

        const db = dbConnection.getDb();
        const usersCollection: Collection<User> = db.collection('users');
        const user = await usersCollection.findOne({clerkUserId: userId});
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    })
    .post(requireAuth(), async (req, res) => {
      console.log("Place holder for post at /api/user")
    })
    .put(requireAuth(), async (req, res) => {
      console.log("Place holder for put at /api/user");
    })



    app.route('/api/settings')
    .get(requireAuth(), async (req, res) => {
      const {userId} = getAuth(req);
      if (!userId) {
        return res.status(401).json({error: "User not authenticated"});
      }

      try {
        const db = dbConnection.getDb();
        const usersCollection: Collection<User> = db.collection('users');
        const user = await usersCollection.findOne({ clerkUserId: userId });

        const defaultSettings: UserSettings = {
          name: "ABC" + ' ' + "XYZ",
          latitude: 40.7128,
          longitude: -74.0060,
          theme: 'light',
          notifyEmail: true,
          notifyPhone: true,
          email: " .  ",
          phone: '',
          phoneProvider: 'AT&T',
          lastUpdated: new Date()
        };

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // If no settings exist yet, return default settings
        if (!user.settings) {
          return res.json(defaultSettings);
        }

        return res.json(user.settings)
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    })
    .post(requireAuth(), async (req, res) => {
      const { userId } = getAuth(req);
        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }
      try{
        const db = dbConnection.getDb();
        const usersCollection: Collection<User> = db.collection('users');

        // Validate the request body
        const settings: UserSettings = {
          ...req.body,
          lastUpdated: new Date()
        };

        // Update the user's settings
        const result = await usersCollection.updateOne(
          { clerkUserId: userId },
          { $set: { settings: settings } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(settings);
      } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });

    app.get('/api/weather', async (req, res) => {
      const { paramLat = '42.3952875', paramLon = '-72.5310819' }:{paramLat?: string, paramLon?: string} = req.query;
      const apiKey = process.env.OPENWEATHER_KEY;
      const lat = parseFloat(paramLat);
      const lon = parseFloat(paramLon);
      const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    
      try {
        // Fetch data from the OpenWeather API
        const response = await fetch(apiURL);
    
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error(`OpenWeather API error: ${response.statusText}`);
        }
    
        // Parse the JSON data
        const weatherData = await response.json();
    
        // Send the JSON data to the client
        res.json(weatherData);
      } catch (error) {
        if(error instanceof Error){
          console.error('Error fetching weather data:', error.message);
        }
        res.status(500).json({ error: 'Failed to fetch weather data' });
      }
    });

    app.get('/api/forecast', async (req, res) => {
      const { paramLat = '42.3952875', paramLon = '-72.5310819' }:{paramLat?: string, paramLon?: string} = req.query;
      const apiKey = process.env.OPENWEATHER_KEY;
      const lat = parseFloat(paramLat);
      const lon = parseFloat(paramLon);
      const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    
      try {
        // Fetch data from the OpenWeather API
        const response = await fetch(apiURL);
    
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error(`OpenWeather API error: ${response.statusText}`);
        }
    
        // Parse the JSON data
        const forecastData = await response.json();
    
        // Send the JSON data to the client
        res.json(forecastData);
      } catch (error) {
        if(error instanceof Error){
          console.error('Error fetching forecast data:', error.message);
        }
        res.status(500).json({ error: 'Failed to fetch forecast data' });
      }
    });
    /* 
    The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
    Vercel routes static/client-side files instead of Express, but this can be changed in vercel.json if needed.
    To let Express handle routing on Vercel, the only route in vercel.json should be: {"src": "/(.*)","dest": "server/src/server.ts"}
    This would be inefficient as it would spin up an edge function for this entire Express app for every cold request.
    So let's stick to using Express for the API and let Vercel handle the client-side routing.
    */

    /*
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
    });
    */
    app.get('/api/events', (req, res)=>{
      res.json(randomEvent);
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  } 
}

startServer();