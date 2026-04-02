require('dotenv').config({ path: '.env.local' });

const admin = require('firebase-admin');
const { getApps, initializeApp } = require('firebase-admin/app');

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

if (!getApps().length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const email = 'test@example.com';
const password = 'TestPassword123!';

admin.auth().createUser({
  email: email,
  password: password,
  emailVerified: true,
  displayName: 'Test User'
}).then((userRecord) => {
  console.log('✅ Test user created successfully!');
  console.log('   Email:', email);
  console.log('   Password:', password);
  console.log('   UID:', userRecord.uid);
  process.exit(0);
}).catch((error) => {
  if (error.code === 'auth/email-already-exists') {
    console.log('ℹ️ Test user already exists.');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   You can use these credentials to log in.');
  } else {
    console.error('❌ Error creating test user:', error.message);
    console.error('   Make sure your Firebase Admin credentials are correctly set in .env.local');
  }
  process.exit(1);
});