import { MongoClient, ServerApiVersion, Db } from 'mongodb';

const dbname: string = "stargazerdb"

class DatabaseConnection{
    private static instance: DatabaseConnection;
    private client: MongoClient;
    private db: Db | null = null;

    private constructor() {
        const uri = process.env.MONGO_URI || "this should give an error - no MONGO_URI in .env";
        this.client = new MongoClient(uri);
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
        DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(dbname);
            console.log('Successfully connected to MongoDB.');

            // Optional: Verify connection
            await this.db.command({ ping: 1 });
            console.log('Database ping successful');

            process.on('SIGINT', async () => {
                await this.client.close();
                console.log('MongoDB connection closed.');
                process.exit(0);
            });
        } catch (error) {
            console.error('Database connection failed:', error);
            process.exit(1);
        }
    }

    public getDb(): Db {
        if (!this.db) {
          throw new Error('Database not initialized. Call connect first.');
        }
        return this.db;
    }
}

// Export a singleton instance
export const dbConnection = DatabaseConnection.getInstance();
