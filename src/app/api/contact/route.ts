import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Identity verification failed. Name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Routing destination invalid. Enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Payload size insufficient. Message must be at least 10 characters.' },
        { status: 400 }
      );
    }

    // Simulate network processing and packet transmission latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a production environment, you would integrate Nodemailer, SendGrid, or save to a database here.
    console.log(`[API Gateway] Data packet received from: ${name} <${email}>`);
    console.log(`[API Gateway] Message payload: ${message}`);

    return NextResponse.json({
      success: true,
      message: 'Transmission successful. Data packet securely stored in Quantum Core.',
      timestamp: new Date().toISOString(),
      packetId: `QGATE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });
  } catch (error) {
    console.error('[API Gateway Error] Failed to process payload:', error);
    return NextResponse.json(
      { success: false, error: 'Gateway critical error. Data packet corrupted during transmission.' },
      { status: 500 }
    );
  }
}
