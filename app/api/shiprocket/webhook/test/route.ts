import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const testData = await request.json();
    console.log('Webhook test received:', JSON.stringify(testData, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test webhook received successfully',
      received_data: testData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json(
      { error: 'Test webhook failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Shiprocket webhook test endpoint is active',
    timestamp: new Date().toISOString(),
    endpoint: '/api/shiprocket/webhook/test'
  });
}