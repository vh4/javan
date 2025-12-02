import { connectToMongoDB, disconnectFromMongoDB } from './mongodb';

export async function testMongoConnection() {
  try {
    console.log('Testing MongoDB Atlas connection...');

    // Test connection
    const db = await connectToMongoDB();

    // Test database access by listing collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Test write operation with a simple test document
    const testResult = await db.collection('connection-test').insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Connection test successful'
    });

    console.log('Test document inserted with ID:', testResult.insertedId);

    // Clean up test document
    await db.collection('connection-test').deleteOne({ _id: testResult.insertedId });
    console.log('Test document cleaned up');

    console.log('✅ MongoDB Atlas connection test successful!');

    return true;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection test failed:', error);
    return false;
  } finally {
    await disconnectFromMongoDB();
  }
}