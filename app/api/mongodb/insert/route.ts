import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbManager.connectAll();

    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields (name, email, password) are required' },
        { status: 400 }
      );
    }

    // Save to MongoDB using the dedicated createUser method
    const result = await dbManager.createUser({ name, email, password });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: 'User data saved to MongoDB Atlas successfully',
    });
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await dbManager.connectAll();

    // Get all users from MongoDB
    const users = await dbManager.getAllUsers();

    return NextResponse.json({
      success: true,
      users,
      message: 'Retrieved all users from MongoDB Atlas',
    });
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}