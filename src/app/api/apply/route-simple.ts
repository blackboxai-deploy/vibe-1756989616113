import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const {
      name,
      email,
      phone,
      courseId,
      courseName,
      education,
      qualifications,
      resumeUrl,
      message
    } = formData;

    // Validation
    if (!name || !email || !courseId || !courseName) {
      return NextResponse.json(
        { message: 'Name, email, course are required' },
        { status: 400 }
      );
    }

    // Log the application (in a real app, this would go to database)
    console.log('New Application Submitted:', {
      name,
      email,
      phone,
      courseId,
      courseName,
      education,
      qualifications,
      resumeUrl,
      message,
      timestamp: new Date().toISOString()
    });

    // For now, just return success
    // In production, this would:
    // 1. Save to database (MySQL)
    // 2. Send email notification
    // 3. Process file upload to cloud storage

    return NextResponse.json(
      { message: 'Application submitted successfully', success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}