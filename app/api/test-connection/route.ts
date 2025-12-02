import { NextResponse } from 'next/server';
import { testMongoConnection } from '@/lib/test-connection';

export async function GET() {
  try {
    const success = await testMongoConnection();

    return NextResponse.json({
      success,
      message: success
        ? 'MongoDB Atlas connection test successful'
        : 'MongoDB Atlas connection test failed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Connection test API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test MongoDB Atlas connection',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}