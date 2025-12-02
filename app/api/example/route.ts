import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Connect to both databases
    await dbManager.connectAll();

    const body = await request.json();
    const { name, email, password, metadata } = body;

    // Save user to PostgreSQL via Prisma
    const user = await dbManager.createUser({
      name,
      email,
      password,
    });

    // Save additional metadata to MongoDB
    const mongoResult = await dbManager.saveToMongoDB('user_metadata', {
      userId: user.id,
      metadata,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      user,
      mongoId: mongoResult.insertedId,
      message: 'Data saved to both databases',
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
    // Connect to both databases
    await dbManager.connectAll();

    // Get all users from PostgreSQL
    const prisma = dbManager.getPrismaClient();
    const users = await prisma.user.findMany();

    // Get all metadata from MongoDB
    const metadata = await dbManager.findFromMongoDB('user_metadata');

    return NextResponse.json({
      success: true,
      users,
      metadata,
      message: 'Retrieved data from both databases',
    });
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}