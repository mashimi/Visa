import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  if (!isAdminInitialized() || !auth || !db) {
    return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 503 });
  }

  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Create user with Firebase Admin Auth (Server-side)
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Create user profile in Firestore using Admin SDK
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name: name || 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      missionIntelligence: [], // Initialize for RAG
    });

    // 3. Optional: Create custom claims or initial setup
    
    return NextResponse.json({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Check if user already exists
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}