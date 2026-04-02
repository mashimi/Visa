import { NextRequest, NextResponse } from 'next/server';
import { db, isAdminInitialized } from '@/lib/firebase-admin';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(req: NextRequest) {
  if (!isAdminInitialized()) {
    return NextResponse.json(
      { 
        error: 'Firebase Admin not configured',
        message: 'Please configure Firebase Admin credentials in .env.local to use this feature.',
        setupGuide: 'https://firebase.google.com/docs/admin/setup'
      },
      { status: 503 }
    );
  }

  try {
    const { email, password } = await req.json();

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    let userData = null;
    if (db) {
      const userDoc = await db.collection('users').doc(user.uid).get();
      userData = userDoc.data();
    }

    return NextResponse.json({
      user: {
        id: user.uid,
        email: user.email,
        name: userData?.name || user.displayName,
      },
      token: await user.getIdToken(),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}