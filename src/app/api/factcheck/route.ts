import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'https://factcheck-ai-backend.onrender.com';
const API_KEY = process.env.FACTCHECK_API_KEY; // Server-side only, not NEXT_PUBLIC

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request
    if (!body.claim || typeof body.claim !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: claim is required and must be a string' },
        { status: 400 }
      );
    }

    if (body.claim.length > 1000) {
      return NextResponse.json(
        { error: 'Claim too long: maximum 1000 characters' },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/v1/factcheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: JSON.stringify({ claim: body.claim }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Backend service error' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('FactCheck API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 