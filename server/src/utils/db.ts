import fs from 'fs';
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { AstronomicalEvent, getDailyEvents } from './events.js';
import { AssetKey } from 'node:sea';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbFilePath = path.join(__dirname, 'db.json');
console.log(__dirname);

// Function to read the DB
export const readDb = (): { astronomicalEvents: AstronomicalEvent[] } => {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return { astronomicalEvents: [] }; // Return an empty array in case of error
  }
};

// Function to write data to the DB
export const writeDb = (data: { astronomicalEvents: AstronomicalEvent[] }) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
};

// Function to add an event to the database
export const addEvent = (event: AstronomicalEvent) => {
  const db = readDb();
  db.astronomicalEvents.push(event);
  writeDb(db);
};

// Function to get all events from the database
export const getAllEvents = (): AstronomicalEvent[] => {
    let db = readDb();
  
    // If no events exist in the db, generate new ones
    if (!db.astronomicalEvents || db.astronomicalEvents.length === 0) {
      const astronomicalEvents: AstronomicalEvent[] = [];
      
      // Generate 7 days of events and add to the array
      for (let i = 0; i < 7; i++) {
        astronomicalEvents.push(...getDailyEvents());
      }
  
      // Add generated events to the database
      astronomicalEvents.forEach((event) => {
        addEvent(event);
      });
  
      // Re-read the db to ensure the new events are present
      db = readDb();
    }
  
    // Return the list of events from the database
    return db.astronomicalEvents;
  };
  

// Function to find an event by ID
export const getEventById = (id: string): AstronomicalEvent | undefined => {
  const db = readDb();
  return db.astronomicalEvents.find((event) => event.id === id);
};

export const clearDb = () => {
    try {
        // Reset the contents of the db.json file to an empty structure
        writeDb({ astronomicalEvents: [] });
        console.log('Database cleared successfully');
    } catch (error) {
        console.error('Error clearing the database:', error);
    }
};

export const removeExpiredEvents = () => {
    try {
      const db = readDb();
  
      // Get current date (today's date)
      const currentDate = new Date();
  
      // Filter out events that have already occurred (expired events)
      const updatedEvents = db.astronomicalEvents.filter(event => {
        // Assume the event has a 'date' field which is a valid date string
        const eventEndDate = new Date(event.endDate);
        return eventEndDate >= currentDate; // Keep only future events
      });
  
      // Write the updated list of events back to the database
      writeDb({ astronomicalEvents: updatedEvents });
  
      console.log('Expired events removed successfully');
    } catch (error) {
      console.error('Error removing expired events:', error);
    }
  };