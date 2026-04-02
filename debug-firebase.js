const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

console.log("Has Project ID?", !!envConfig.FIREBASE_PROJECT_ID);
console.log("Has Private Key?", !!envConfig.FIREBASE_PRIVATE_KEY);

const privateKey = envConfig.FIREBASE_PRIVATE_KEY;
console.log("Raw Key Start:", privateKey ? privateKey.substring(0, 30) : "N/A");
console.log("Raw Key End:", privateKey ? privateKey.substring(privateKey.length - 30) : "N/A");
console.log("Contains BEGIN?", privateKey?.includes('-----BEGIN PRIVATE KEY-----'));
console.log("Contains literal \\n?", privateKey?.includes('\\n'));
console.log("Contains real newline?", privateKey?.includes('\n'));

const parsedKey = privateKey
    ? privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
    : undefined;

console.log("Parsed Key Contains real newline?", parsedKey?.includes('\n'));
console.log("Parsed Key Start:", parsedKey ? parsedKey.substring(0, 30) : "N/A");

