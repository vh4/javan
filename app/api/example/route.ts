import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbManager.connectAll();

    const body = await request.json();
    const { name, email, password, metadata } = body;

    // Save user to MongoDB
    const userResult = await dbManager.createUser({
      name,
      email,
      password,
    });

    // Save additional metadata to MongoDB
    const mongoResult = await dbManager.saveToMongoDB('user_metadata', {
      userId: userResult.insertedId,
      metadata,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      userId: userResult.insertedId,
      metadataId: mongoResult.insertedId,
      message: 'User and metadata saved to MongoDB Atlas',
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Optionally disconnect (not recommended for production)
    // await dbManager.disconnectAll();
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await dbManager.connectAll();

    // Get all users from MongoDB
    const users = await dbManager.getAllUsers();

    // Get all metadata from MongoDB
    const metadata = await dbManager.findFromMongoDB('user_metadata');

    return NextResponse.json({
      success: true,
      users,
      metadata,
      message: 'Retrieved data from MongoDB Atlas',
    });
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}