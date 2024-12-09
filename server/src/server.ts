import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { requireAuth, getAuth } from '@clerk/express';
import 'dotenv/config'; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import cors from "cors";
import { Collection } from 'mongodb';
import { dbConnection } from './data_access_module.js';
import { EventsDatabase, eventsDatabase } from './events_access_module.js';

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
  events? : Event[];
}

interface UserSettings {
  name: string;
  latitude: number;
  longitude: number;
  theme: 'dark' | 'light' | 'red';
  notifyEmail: boolean;
  notifyPhone: boolean;
  notifyFrequency : '1h' | '6h' | '12h' | '24h';
  email: string;
  phone: string;
  phoneProvider: string;
  lastUpdated: Date;
}

interface Event {
  latitude: number;
  longitude: number;
  time: Date;
  name?: string;
  description?: string;
  createdAt: Date;
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

        if (user) { // user exists, return user
          return res.status(200).json(user);
        }

        const {_firstname, _lastname, _username, _email, _last_location} = req.body;
        if (!_firstname || !_lastname || !_username || !_email){
          return res.status(400).json({error : "Missing user fields"});
        }

        const newuser = {
          clerkUserId:userId, 
          _id:userId, 
          _firstname,
          _lastname, 
          _username,
          _email, 
          _last_location : 
          _last_location ? {
            ..._last_location, time:new Date()
          } : undefined, 
        };

        const result = await usersCollection.insertOne(newuser);
        if (result.acknowledged){
          res.status(201).json(user);
        } else {
          res.status(500).json({error: "Failed to create user"})
        }
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

    // Route to retrieve user settings
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
          notifyFrequency: '24h',
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

    app.route('/api/user/events')
      .get(requireAuth(), async (req, res) => {
        const { userId } = getAuth(req);
        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }
        
        try {
          const db = dbConnection.getDb();
          const usersCollection: Collection<User> = db.collection('users');
          
          // Find user and return events
          const user = await usersCollection.findOne(
            { clerkUserId: userId },
            { projection: { events: 1 } }
          );
    
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
    
          res.status(200).json(user.events || []);
        } catch (error) {
          res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
      })
      .post(requireAuth(), async (req, res) => {
        const { userId } = getAuth(req);
        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }
        
        try {
          const db = dbConnection.getDb();
          const usersCollection: Collection<User> = db.collection('users');
    
          // Validate the new event
          const newEvent: Event = {
            ...req.body,
            createdAt: new Date()
          };
    
          // Add event to user's events array
          const result = await usersCollection.updateOne(
            { clerkUserId: userId },
            { 
              $push: { events: newEvent },
              $set: { '_last_location.time': new Date() } // Optional: update last location time
            }
          );
    
          if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          res.status(201).json(newEvent);
        } catch (error) {
          res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
      })
      .delete(requireAuth(), async (req, res) => {
        const { userId } = getAuth(req);
        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }
        
        try {
          const { eventId } = req.body;
          if (!eventId) {
            return res.status(400).json({ error: 'Event ID is required' });
          }
    
          const db = dbConnection.getDb();
          const usersCollection: Collection<User> = db.collection('users');
    
          // Remove specific event from the events array
          const result = await usersCollection.updateOne(
            { clerkUserId: userId },
            { 
              $pull: { events: { _id: eventId } },
              $set: { '_last_location.time': new Date() } // Optional: update last location time
            }
          );
    
          if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
      });

    app.route('/api/admin/user/events')
    .get(async (req, res) => {
      try {
        const db = dbConnection.getDb();
        const usersCollection: Collection<User> = db.collection('users');
        
        // Check if a specific user ID is provided
        const { userId } = req.query;
  
        // If userId is provided, fetch events for that specific user
        if (userId) {
          const user = await usersCollection.findOne(
            { clerkUserId: userId as string },
            { projection: { events: 1, _firstname: 1, _lastname: 1 } }
          );
  
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
  
          return res.status(200).json({
            userId: user.clerkUserId,
            name: `${user._firstname} ${user._lastname}`,
            events: user.events || []
          });
        }
  
        // If no userId, fetch all users with their events
        const users = await usersCollection.find(
          {},
          { 
            projection: { 
              clerkUserId: 1, 
              _firstname: 1, 
              _lastname: 1, 
              events: 1 
            } 
          }
        ).toArray();
  
        // Transform the result to include only users with events
        const usersWithEvents = users
          .filter(user => user.events && user.events.length > 0)
          .map(user => ({
            userId: user.clerkUserId,
            name: `${user._firstname} ${user._lastname}`,
            events: user.events
          }));
  
        res.status(200).json(usersWithEvents);
      } catch (error) {
        res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
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
   // Route to get all events
    app.get('/api/events', async (req, res) => {
      try {
        // Remove expired events from the database
        const eventdb = await eventsDatabase
        await eventdb.removeExpiredEvents();

        // Retrieve all events
        const events = await eventdb.getAllEvents();

        // Respond with the events data
        res.status(200).json(events);
      } catch (error) {
        // Handle any potential errors
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'An error occurred while fetching events.' });
      }
    });

    // Route to get events near a specific location
    app.get('/api/events/near', async (req, res) => {
      try {
        // Retrieve the location (latitude, longitude, and radius) from query parameters
        let { paramLat = '42.3952875', paramLon = '-72.5310819', paramRadius = '500' } = req.query;

        // Parse the query parameters as floats
        const latitude = parseFloat(paramLat as string);
        const longitude = parseFloat(paramLon as string);
        const radius = parseFloat(paramRadius as string);

        // Validate if the parameters are valid numbers
        if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
          return res.status(400).json({
            error: 'Invalid location or radius values. Please provide valid numbers.',
          });
        }

        // Find nearby events
        const eventdb = await eventsDatabase
        const nearbyEvents = await eventdb.findEventsNearLocation(
          latitude, 
          longitude, 
          radius
        );

        // Respond with the nearby events
        res.status(200).json(nearbyEvents);
      } catch (error) {
        // Log the error and respond with a generic error message
        console.error('Error fetching events near location:', error);
        res.status(500).json({
          error: 'An error occurred while fetching events near the location.',
        });
      }
    });

    // Route to get a specific event by ID
    app.get('/api/events/:id', async (req, res) => {
      try {
        const { id } = req.params; // Extract the event ID from the request parameters
        const eventdb = await eventsDatabase
        const event = await eventdb.getEventById(id); // Get the event by ID
        
        if (event) {
          // If the event is found, return it with a 200 status code
          res.status(200).json(event);
        } else {
          // If the event is not found, return a 404 status code
          res.status(404).json({ error: 'Event not found' });
        }
      } catch (error) {
        // Handle any errors
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching the event.' });
      }
    });

    // Route to clear all events
    app.delete('/api/events', async (req, res) => {
      try {
        const eventdb = await eventsDatabase
        await eventdb.clearDb(); // Clear the database
        res.status(200).json({ message: 'All events have been cleared successfully' });
      } catch (error) {
        console.error('Error clearing database:', error);
        res.status(500).json({ error: 'Failed to clear events' });
      }
    });

    // Route to populate events
    app.post('/api/events/populate', async (req, res) => {
      try {
        // Populate the database with a week of events
        const eventdb = await eventsDatabase
        await eventdb.populateEvents();

        // Respond with a success message
        res.status(200).json({ message: 'Successfully populated the database with a week of events.' });
      } catch (error) {
        // Handle any errors
        console.error('Error populating events:', error);
        res.status(500).json({ error: 'An error occurred while populating events.' });
      }
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