import { MongoClient, Db } from 'mongodb';

// Connection URI for MongoDB Atlas
const uri =  'mongodb+srv://uguestberkah:uIKnB9SHzImh6RJq@cluster0.xnnbunu.mongodb.net/tony?appName=Cluster0';
const dbName = 'tony';

// Create a MongoClient with options optimized for Atlas
const client = new MongoClient(uri, {
  // Recommended connection settings for Atlas
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});

let db: Db;

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    throw error;
  }
}

export async function disconnectFromMongoDB(): Promise<void> {
  try {
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB Atlas:', error);
    throw error;
  }
}

export function getMongoDb(): Db {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectToMongoDB() first.');
  }
  return db;
}

export { client };