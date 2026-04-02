import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { getAuth, Auth } from 'firebase-admin/auth';

// Singleton pattern for Firebase Admin initialization
let adminApp: App | null = null;
let _db: Firestore | null = null;
let _storage: Storage | null = null;
let _auth: Auth | null = null;
let _initialized = false;
let _initFailed = false;

function checkValidCredentials(): boolean {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  
  if (!privateKey || !projectId) {
    return false;
  }
  
  // Clean the private key for validation
  const cleanedKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
  
  if (!cleanedKey.includes('-----BEGIN PRIVATE KEY-----')) {
    return false;
  }
  
  if (projectId === 'your_project_id') {
    return false;
  }
  
  return true;
}

function getServiceAccount(): ServiceAccount | null {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  if (!privateKey || !projectId || !clientEmail) {
    return null;
  }
  
  const cleanedKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
  
  return {
    type: "service_account",
    project_id: projectId,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: cleanedKey,
    client_email: clientEmail,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  } as ServiceAccount;
}

export function initializeFirebaseAdmin(): boolean {
  // Return early if already initialized or if initialization previously failed
  if (_initialized && adminApp !== null) {
    return true;
  }
  
  if (_initFailed) {
    return false;
  }
  
  const hasValidCredentials = checkValidCredentials();
  
  if (!hasValidCredentials) {
    console.warn('⚠️ Firebase Admin credentials not configured properly.');
    console.warn('Please configure valid FIREBASE_PRIVATE_KEY and other credentials in .env.local');
    console.warn('See: https://firebase.google.com/docs/admin/setup for setup instructions.');
    _initFailed = true;
    return false;
  }
  
  try {
    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
      _initFailed = true;
      return false;
    }
    
    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    } else {
      adminApp = getApps()[0];
    }
    
    _db = getFirestore();
    _storage = getStorage();
    _auth = getAuth();
    _initialized = true;
    
    console.log('✅ Firebase Admin initialized successfully');
    return true;
  } catch (error) {
    console.warn('⚠️ Firebase Admin initialization failed:', error);
    console.warn('Please configure valid FIREBASE_PRIVATE_KEY and other credentials in .env.local');
    _initFailed = true;
    return false;
  }
}

// Try to initialize on module load
initializeFirebaseAdmin();

export const db: Firestore | null = _db;
export const storage: Storage | null = _storage;
export const auth: Auth | null = _auth;
export const isAdminInitialized = (): boolean => {
  // Try to initialize if not already done
  if (!_initialized && !_initFailed) {
    return initializeFirebaseAdmin();
  }
  return _initialized && adminApp !== null;
};
