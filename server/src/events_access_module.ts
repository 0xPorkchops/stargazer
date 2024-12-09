import { Collection } from 'mongodb';
import { dbConnection } from './data_access_module.js';
import { generateRandomAstronomicalEvent, getDailyEvents, AstronomicalEvent } from './utils/events.js';

// Define the interface for the events collection in MongoDB
interface EventsCollection {
  astronomicalEvents: AstronomicalEvent[];
}

export class EventsDatabase {
  private static instance: EventsDatabase;
  private collection!: Collection<AstronomicalEvent>;

  private constructor() {
  };

  public async initialize(){
    try{
        await dbConnection.connect();  // Connect to the DB asynchronously
        const db = dbConnection.getDb();
        EventsDatabase.instance = new EventsDatabase();
        EventsDatabase.instance.collection = db.collection('astronomicalEvents');

    } catch (error) {
        throw error;
    }
    
  }

  // Singleton pattern to ensure only one instance
  public static async getInstance(): Promise<EventsDatabase> {
    try{
      if (!EventsDatabase.instance) {
        EventsDatabase.instance = new EventsDatabase();
        await EventsDatabase.instance.initialize();
      }
    } catch (error) {

    }
    
    return EventsDatabase.instance;
  }

  // Add a single event to the database
  public async addEvent(event: AstronomicalEvent): Promise<void> {
    try {
      await this.collection.insertOne(event);
    } catch (error) {
      console.error('Error adding event to database:', error);
      throw error;
    }
  }

  // Get all events from the database
  public async getAllEvents(): Promise<AstronomicalEvent[]> {
    try {
      let events = await this.collection.find().toArray();

      // If no events exist, generate and add new ones
      if (!events || events.length === 0) {
        const astronomicalEvents: AstronomicalEvent[] = [];
        
        // Generate 7 days of events
        for (let i = 0; i < 7; i++) {
          astronomicalEvents.push(...getDailyEvents());
        }

        // Add generated events to the database
        await this.collection.insertMany(astronomicalEvents);

        // Retrieve the newly added events
        events = await this.collection.find().toArray();
      }

      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Find an event by its ID
  public async getEventById(id: string): Promise<AstronomicalEvent | null> {
    try {
      return await this.collection.findOne({ id: id });
    } catch (error) {
      console.error('Error finding event by ID:', error);
      return null;
    }
  }

  // Remove expired events from the database
  public async removeExpiredEvents(): Promise<void> {
    try {
      const currentDate = new Date();

      // Delete events where the end date is in the past
      await this.collection.deleteMany({ 
        endDate: { $lt: currentDate.toISOString() } 
      });

      console.log('Expired events removed successfully');
    } catch (error) {
      console.error('Error removing expired events:', error);
    }
  }

  // Clear all events from the database
  public async clearDb(): Promise<void> {
    try {
      await this.collection.deleteMany({});
      console.log('Database cleared successfully');
    } catch (error) {
      console.error('Error clearing the database:', error);
    }
  }

  // Find events near a specific location within a given radius
  public async findEventsNearLocation(
    latitude: number, 
    longitude: number, 
    radiusInKm: number
  ): Promise<AstronomicalEvent[]> {
    try {
      // MongoDB geospatial query to find events within the specified radius
      const events = await this.collection.find({
        'location.coordinates': {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radiusInKm / 6371] // 6371 is Earth's radius in km
          }
        }
      }).toArray();

      return events;
    } catch (error) {
      console.error('Error finding events near location:', error);
      return [];
    }
  }

  // Populate database with a week of events
  public async populateEvents(): Promise<void> {
    try {
      // Clear existing events
      await this.clearDb();

      // Generate 7 days worth of events
      const eventsToAdd: AstronomicalEvent[] = [];
      for (let i = 0; i < 7; i++) {
        eventsToAdd.push(...getDailyEvents());
      }

      // Add the generated events to the database
      await this.collection.insertMany(eventsToAdd);

      console.log('Successfully populated the database with a week of events');
    } catch (error) {
      console.error('Error populating events:', error);
    }
  }
}

// Export a singleton instance for easy use
export const eventsDatabase = EventsDatabase.getInstance();