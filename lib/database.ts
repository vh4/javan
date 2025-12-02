import { connectToMongoDB, disconnectFromMongoDB, getMongoDb } from './mongodb';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private isMongoConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // MongoDB methods
  public async connectMongoDB() {
    if (!this.isMongoConnected) {
      await connectToMongoDB();
      this.isMongoConnected = true;
    }
  }

  public getMongoDb() {
    return getMongoDb();
  }

  // Connect to MongoDB
  public async connectAll() {
    try {
      // Connect to MongoDB
      await this.connectMongoDB();
      console.log('Connected to MongoDB Atlas successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  // Disconnect from MongoDB
  public async disconnectAll() {
    try {
      // Disconnect from MongoDB
      await disconnectFromMongoDB();
      console.log('Disconnected from MongoDB Atlas');
    } catch (error) {
      console.error('Failed to disconnect from MongoDB:', error);
      throw error;
    }
  }

  // User management methods for MongoDB
  public async createUser(userData: { name: string; email: string; password: string }) {
    const db = this.getMongoDb();
    const result = await db.collection('users').insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  }

  public async getUserByEmail(email: string) {
    const db = this.getMongoDb();
    const user = await db.collection('users').findOne({ email });
    return user;
  }

  public async getAllUsers() {
    const db = this.getMongoDb();
    const users = await db.collection('users').find({}).toArray();
    return users;
  }

  // General MongoDB operations
  public async saveToMongoDB(collection: string, data: Record<string, unknown>) {
    const db = this.getMongoDb();
    const result = await db.collection(collection).insertOne({
      ...data,
      createdAt: new Date(),
    });
    return result;
  }

  public async findFromMongoDB(collection: string, query: Record<string, unknown> = {}) {
    const db = this.getMongoDb();
    const result = await db.collection(collection).find(query).toArray();
    return result;
  }

  public async findOneFromMongoDB(collection: string, query: Record<string, unknown>) {
    const db = this.getMongoDb();
    const result = await db.collection(collection).findOne(query);
    return result;
  }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance();